# Requirements Document

## Introduction

This feature implements the `PromiseRejectionEvent` interface in Happy DOM to match the web standard available in browsers. The `PromiseRejectionEvent` is fired when a JavaScript Promise is rejected and no rejection handler is attached to the promise within a turn of the event loop. This is essential for proper error handling and debugging in applications using Happy DOM, particularly in Jest test environments.

## Requirements

### Requirement 1

**User Story:** As a developer using Happy DOM in Jest tests, I want `PromiseRejectionEvent` to be available on the window object, so that my code that relies on this web standard works correctly in the test environment.

#### Acceptance Criteria

1. WHEN I access `window.PromiseRejectionEvent` THEN the system SHALL return the PromiseRejectionEvent constructor
2. WHEN I create a new Window instance THEN the system SHALL make PromiseRejectionEvent available as a global property
3. WHEN I use `new window.PromiseRejectionEvent()` THEN the system SHALL create a valid PromiseRejectionEvent instance

### Requirement 2

**User Story:** As a developer, I want to create PromiseRejectionEvent instances with proper properties, so that I can handle promise rejection events according to web standards.

#### Acceptance Criteria

1. WHEN I create a PromiseRejectionEvent with type and eventInitDict THEN the system SHALL set the promise property correctly
2. WHEN I create a PromiseRejectionEvent with type and eventInitDict THEN the system SHALL set the reason property correctly
3. WHEN I access the promise property THEN the system SHALL return the rejected promise
4. WHEN I access the reason property THEN the system SHALL return the rejection reason

### Requirement 3

**User Story:** As a developer, I want PromiseRejectionEvent to inherit from Event, so that it behaves like other DOM events and can be used with event listeners.

#### Acceptance Criteria

1. WHEN I create a PromiseRejectionEvent THEN the system SHALL ensure it inherits from Event
2. WHEN I check `instanceof Event` on a PromiseRejectionEvent THEN the system SHALL return true
3. WHEN I use event methods like preventDefault() THEN the system SHALL work as expected for DOM events

### Requirement 4

**User Story:** As a developer using Jest with @happy-dom/jest-environment, I want unhandled promise rejections to trigger the appropriate events, so that my error handling code works the same as in browsers.

#### Acceptance Criteria

1. WHEN an unhandled promise rejection occurs THEN the system SHALL fire an 'unhandledrejection' event
2. WHEN the 'unhandledrejection' event is fired THEN the system SHALL use PromiseRejectionEvent as the event type
3. WHEN a previously unhandled rejection gets a handler THEN the system SHALL fire a 'rejectionhandled' event

### Requirement 5

**User Story:** As a developer, I want the PromiseRejectionEvent implementation to match MDN specifications, so that my code is portable between Happy DOM and real browsers.

#### Acceptance Criteria

1. WHEN I check the constructor name THEN the system SHALL return "PromiseRejectionEvent"
2. WHEN I access PromiseRejectionEvent properties THEN the system SHALL match the MDN specification interface
3. WHEN I use PromiseRejectionEvent in TypeScript THEN the system SHALL provide proper type definitions
4. WHEN I serialize a PromiseRejectionEvent THEN the system SHALL include the standard properties