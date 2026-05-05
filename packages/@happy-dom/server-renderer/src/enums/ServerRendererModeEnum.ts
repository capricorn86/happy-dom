enum ServerRendererModeEnum {
	// Use a Browser instance in each worker to render pages.
	browser = 'browser',
	// Render a single page in each worker without using VM isolation which may not be supported in some execution environments.
	page = 'page'
}

export default ServerRendererModeEnum;
