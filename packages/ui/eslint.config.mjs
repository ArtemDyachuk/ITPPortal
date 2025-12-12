import { config } from "@repo/eslint-config/react-internal";

// Extend the shared React config and disable prop-types enforcement for
// TypeScript code (we use TS interfaces for runtime safety and PropTypes are
// redundant). This keeps linting clean without adding runtime PropTypes.
const uiConfig = [
	...config,
	{
		rules: {
			'react/prop-types': 'off',
		},
	},
];

/** @type {import("eslint").Linter.Config} */
export default uiConfig;
