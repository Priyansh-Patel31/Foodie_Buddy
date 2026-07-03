# Stage 1: Build the Spring Boot application
# Uses a JDK image from Eclipse Temurin for compilation.
FROM eclipse-temurin:17-jdk-focal AS builder
# Set the working directory inside the container for the build stage.
WORKDIR /app
# Copy the Maven wrapper and its directory.
# This allows you to use the Maven wrapper (mvnw) inside the container.
COPY backend/mvnw .
COPY backend/.mvn .mvn
# Copy the build configuration file.
# pom.xml: Main build script and dependency definitions.
COPY backend/pom.xml .
# Copy the source code.
# The `src` directory contains your Java source files, resources, etc.
COPY backend/src src
# Make the Maven wrapper script executable.
RUN chmod +x mvnw
# Build the Spring Boot application into an executable JAR.
# `package` compiles and packages the app into a runnable JAR.
# `-DskipTests` skips running tests during the Docker build, which speeds up the build process.
# This assumes your main JAR will be named `admin-backend-0.0.1-SNAPSHOT.jar` based on your
# pom.xml `artifactId` and `version`.
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the final, lightweight runtime image
# Uses a JRE image from Eclipse Temurin, which is much smaller than a JDK image.
FROM eclipse-temurin:17-jre-focal
# Set the working directory inside the container for the runtime stage.
WORKDIR /app
# Copy the executable JAR from the builder stage to the final image.
# The JAR is copied from `/app/target/admin-backend-0.0.1-SNAPSHOT.jar` in the builder stage
# and renamed to `app.jar` in the current stage for simplicity.
COPY --from=builder /app/target/admin-backend-0.0.1-SNAPSHOT.jar app.jar
# Expose the port on which your Spring Boot application will listen.
# Based on your application.properties, this is 8080.
EXPOSE 8080
# Define the command to run your application when the container starts.
# `java -jar app.jar` executes the Spring Boot application.
# Spring Boot automatically picks up the `server.port` from application.properties
# and will also respect the `PORT` environment variable set by Render if it's different.
ENTRYPOINT ["java", "-jar", "app.jar"]
