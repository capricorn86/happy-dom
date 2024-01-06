enum BrowserErrorCapturingEnum {
	// Happy DOM will try to catch errors, but it will not be able to catch all errors and Promise rejections. This will decrease performance as using try and catch makes the just in time compiles significally slower. This is the default setting.
	tryAndCatch = 'tryAndCatch',
	// Happy DOM will add an event listener to the Node.js process to catch all errors and Promise rejections.
	processLevel = 'processLevel',
	// Error capturing is disabled. All errors and Promise rejections will be thrown.
	disabled = 'disabled'
}

export default BrowserErrorCapturingEnum;
