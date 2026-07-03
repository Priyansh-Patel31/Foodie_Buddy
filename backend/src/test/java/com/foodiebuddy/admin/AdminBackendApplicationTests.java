package com.foodiebuddy.admin;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.web.ServletTestExecutionListener;

@SpringBootTest(properties = {
		"app.data-initialization.enabled=false",
		"spring.data.mongodb.auto-index-creation=false"
})
@TestExecutionListeners(
		listeners = {ServletTestExecutionListener.class, DependencyInjectionTestExecutionListener.class},
		mergeMode = TestExecutionListeners.MergeMode.REPLACE_DEFAULTS
)
class AdminBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
