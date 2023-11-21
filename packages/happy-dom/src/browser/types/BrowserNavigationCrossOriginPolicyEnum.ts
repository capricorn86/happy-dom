enum BrowserNavigationCrossOriginPolicyEnum {
	// The browser can navigate to any origin.
	anyOrigin = 'any-origin',
	// The browser can only navigate to the same origin as the current page or its parent.
	sameOrigin = 'same-origin',
	// The browser can never navigate from a secure protocol (https) to an unsecure protocol (http), but it can always navigate to a secure (https).
	strictOrigin = 'strict-origin'
}

export default BrowserNavigationCrossOriginPolicyEnum;
