# fix: [#1918] XMLSerializer encodes non-breaking spaces as &#160; instead of &nbsp;

## Summary

Fixes #1918 - `XMLSerializer.serializeToString()` now encodes non-breaking spaces as `&#160;` (numeric character reference) instead of `&nbsp;` (HTML named entity).

## Problem

`&nbsp;` is not a valid named entity in XML - only the five predefined entities (`&lt;`, `&gt;`, `&amp;`, `&quot;`, `&apos;`) are supported. When serializing SVG or other XML content containing non-breaking spaces, the output was invalid XML:

```js
const svg = document.querySelector('svg');
new XMLSerializer().serializeToString(svg);
// Before: <tspan>&nbsp;</tspan>  ❌ Invalid XML
// After:  <tspan>&#160;</tspan>  ✅ Valid XML
```

## Solution

Updated `XMLEncodeUtility.encodeTextContent()` to encode non-breaking spaces (`\xA0`) as `&#160;` instead of `&nbsp;`. Also updated the decode logic to handle both `&nbsp;` and `&#160;` for backwards compatibility when parsing.

## Testing

Added test case verifying that `XMLSerializer` outputs `&#160;` and not `&nbsp;` for non-breaking spaces.
