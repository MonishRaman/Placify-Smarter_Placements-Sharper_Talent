

const challenges = [
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    description: 
`Write a function **reverseString(str)** that takes a string as input and returns a new string with the characters in reverse order.

**Example:**
\`\`\`js
reverseString("hello") // returns "olleh"
reverseString("abc")   // returns "cba"
\`\`\`

**Notes:**
- You can use built-in string and array methods if you want.
- Don't forget to return the reversed string, not just log it!`,
    starterCode: `// Complete this function
function reverseString(str) {
  // your code here
}

logger.debug(reverseString("hello")); // Expected: "olleh"`,
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    tags: ["strings", "basic"],
  },
  {
    id: "max-in-array",
    title: "Find the Largest Number in an Array",
    difficulty: "Easy",
    description:
`Write a function **maxInArray(arr)** that returns the highest numeric value in the given array.

**Example:**
\`\`\`js
maxInArray([1, 5, 3])       // returns 5
maxInArray([-10, 0, -3])    // returns 0
\`\`\`

**Notes:**
- The array may contain positive or negative numbers.
- If the array is empty, return **null**.`,
    starterCode: `// Complete this function
function maxInArray(arr) {
  // your code here
}

logger.debug(maxInArray([1, 5, 3])); // Expected: 5`,
    solution: `function maxInArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.reduce((max, v) => (v > max ? v : max), arr[0]);
}`,
    tags: ["arrays", "basic"],
  },
  {
    id: "sum-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Easy",
    description:
`Write a function **sum(a, b)** that takes two numbers and returns their sum.

**Example:**
\`\`\`js
sum(2, 3)  // returns 5
sum(-1, 8) // returns 7
\`\`\`

**Notes:**
- Both inputs will be numbers.
- The function should return the result, not just print it.`,
    starterCode: `function sum(a, b) {
  // Your code here
}

logger.debug(sum(2, 3)); // Expected output: 5`,
    solution: `function sum(a, b) {
  return a + b;
}`,
    tags: ["basic", "math"],
  },
  {
    id: "stopwatch-component",
    title: "Build a Simple Stopwatch (UI Task)",
    difficulty: "Medium",
    description:
`Create a stopwatch that:
1. Displays elapsed time in **mm:ss** format (e.g., 01:05 for 1 min and 5 seconds).
2. Has **Start**, **Stop**, and **Reset** buttons.
3. Updates the time every second while running.

**Implementation options:**
- You can use **React** (with \`useState\` and \`useEffect\`) or vanilla JavaScript with \`setInterval\`.
- Styling is up to you — keep it simple but readable.

**Example:**
\`\`\`
[ 00:00 ]  Start  Stop  Reset
\`\`\``,
    starterCode: `// For React: create a component with useState and useEffect
// or implement using setInterval and DOM updates.

function Stopwatch() {
  // Your implementation here
}`,
    solution: null,
    tags: ["frontend", "component"],
  },
];

export default challenges;
