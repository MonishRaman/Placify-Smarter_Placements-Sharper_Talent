import express from 'express';
import { NodeVM } from 'vm2';

const router = express.Router();

/**
 * @route   POST /api/execute-js
 * @desc    Executes user-provided JavaScript code in a secure sandbox
 * @access  Public
 */
router.post('/execute-js', async (req, res) => {
    try {
        const { code, input } = req.body;

        // Validate input
        if (typeof code !== 'string' || code.trim() === '') {
            return res.status(400).json({ output: '', error: 'Code must be a non-empty string.' });
        }

        // Set up a secure VM environment
        const vm = new NodeVM({
            console: 'redirect', // Redirect console.log to capture output
            timeout: 3000,       // Limit execution time to 3 seconds
            sandbox: { input },  // Provide input in the sandbox
            eval: false,         // Disable eval
            wasm: false,         // Disable WebAssembly
            require: false,      // Disable require
        });

        let output = '';
        let error = null;

        // Capture console.log output from user code
        vm.on('console.log', (msg) => {
            output += msg + '\n';
        });

        // Wrap user code in a function to allow input usage
        const wrappedCode = `module.exports = async (input) => { ${code} }`;

        // Run the user code in the VM
        let userFunc;
        try {
            userFunc = vm.run(wrappedCode, 'user-code.js');
        } catch (compileErr) {
            // Handle syntax or compilation errors
            return res.status(400).json({ output: '', error: `Code compilation error: ${compileErr.message}` });
        }

        // Execute the function and handle runtime errors
        let result;
        try {
            result = await userFunc(input);
        } catch (runtimeErr) {
            return res.status(400).json({ output: output.trim(), error: `Runtime error: ${runtimeErr.message}` });
        }

        // Append result to output if present
        if (result !== undefined) output += String(result);

        // Respond with output and no error
        return res.status(200).json({ output: output.trim(), error: null });

    } catch (err) {
        // Catch-all for unexpected server errors
        return res.status(500).json({ output: '', error: 'Internal server error.' });
    }
});

export default router;
