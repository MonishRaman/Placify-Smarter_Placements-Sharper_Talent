from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn

app = FastAPI(
    title="Blind75 Practice API",
    description="Backend API for Blind75 LeetCode practice problems",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Problem(BaseModel):
    id: int
    title: str
    category: str
    difficulty: str
    leetcode_url: str
    description: str

class UserProgress(BaseModel):
    completed: List[int]
    attempted: List[int]
    total_problems: int

class ProgressResponse(BaseModel):
    message: str
    progress: UserProgress

class ProblemListResponse(BaseModel):
    count: int
    problems: List[Problem]

class CategoryResponse(BaseModel):
    category: str
    count: int
    problems: List[Problem]

class StatsResponse(BaseModel):
    total_problems: int
    difficulty_distribution: Dict[str, int]
    category_distribution: Dict[str, int]

# Blind75 problems data
BLIND75_PROBLEMS = [
    # Array
    Problem(
        id=1,
        title="Two Sum",
        category="Array",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/two-sum/",
        description="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
    ),
    Problem(
        id=2,
        title="Best Time to Buy and Sell Stock",
        category="Array",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        description="You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock."
    ),
    Problem(
        id=3,
        title="Contains Duplicate",
        category="Array",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/contains-duplicate/",
        description="Given an integer array nums, return true if any value appears at least twice in the array."
    ),
    Problem(
        id=4,
        title="Product of Array Except Self",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/product-of-array-except-self/",
        description="Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]."
    ),
    Problem(
        id=5,
        title="Maximum Subarray",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/maximum-subarray/",
        description="Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum."
    ),
    Problem(
        id=6,
        title="Maximum Product Subarray",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/maximum-product-subarray/",
        description="Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product."
    ),
    Problem(
        id=7,
        title="Find Minimum in Rotated Sorted Array",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        description="Suppose an array of length n sorted in ascending order is rotated between 1 and n times."
    ),
    Problem(
        id=8,
        title="Search in Rotated Sorted Array",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/search-in-rotated-sorted-array/",
        description="There is an integer array nums sorted in ascending order (with distinct values)."
    ),
    Problem(
        id=9,
        title="3Sum",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/3sum/",
        description="Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]."
    ),
    Problem(
        id=10,
        title="Container With Most Water",
        category="Array",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/container-with-most-water/",
        description="You are given an integer array height of length n."
    ),

    # Binary
    Problem(
        id=11,
        title="Sum of Two Integers",
        category="Binary",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/sum-of-two-integers/",
        description="Given two integers a and b, return the sum of the two integers without using the operators + and -."
    ),
    Problem(
        id=12,
        title="Number of 1 Bits",
        category="Binary",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/number-of-1-bits/",
        description="Write a function that takes an unsigned integer and returns the number of '1' bits it has."
    ),
    Problem(
        id=13,
        title="Counting Bits",
        category="Binary",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/counting-bits/",
        description="Given an integer n, return an array ans of length n + 1."
    ),
    Problem(
        id=14,
        title="Missing Number",
        category="Binary",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/missing-number/",
        description="Given an array nums containing n distinct numbers in the range [0, n]."
    ),
    Problem(
        id=15,
        title="Reverse Bits",
        category="Binary",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/reverse-bits/",
        description="Reverse bits of a given 32 bits unsigned integer."
    ),

    # Dynamic Programming
    Problem(
        id=16,
        title="Climbing Stairs",
        category="Dynamic Programming",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/climbing-stairs/",
        description="You are climbing a staircase. It takes n steps to reach the top."
    ),
    Problem(
        id=17,
        title="Coin Change",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/coin-change/",
        description="You are given an integer array coins representing coins of different denominations."
    ),
    Problem(
        id=18,
        title="Longest Increasing Subsequence",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-increasing-subsequence/",
        description="Given an integer array nums, return the length of the longest strictly increasing subsequence."
    ),
    Problem(
        id=19,
        title="Longest Common Subsequence",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-common-subsequence/",
        description="Given two strings text1 and text2, return the length of their longest common subsequence."
    ),
    Problem(
        id=20,
        title="Word Break Problem",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/word-break/",
        description="Given a string s and a dictionary of strings wordDict."
    ),
    Problem(
        id=21,
        title="Combination Sum",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/combination-sum-iv/",
        description="Given an array of distinct integers nums and a target integer target."
    ),
    Problem(
        id=22,
        title="House Robber",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/house-robber/",
        description="You are a professional robber planning to rob houses along a street."
    ),
    Problem(
        id=23,
        title="House Robber II",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/house-robber-ii/",
        description="You are a professional robber planning to rob houses along a street."
    ),
    Problem(
        id=24,
        title="Decode Ways",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/decode-ways/",
        description="A message containing letters from A-Z can be encoded into numbers."
    ),
    Problem(
        id=25,
        title="Unique Paths",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/unique-paths/",
        description="There is a robot on an m x n grid."
    ),
    Problem(
        id=26,
        title="Jump Game",
        category="Dynamic Programming",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/jump-game/",
        description="You are given an integer array nums."
    ),

    # Graph
    Problem(
        id=27,
        title="Clone Graph",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/clone-graph/",
        description="Given a reference of a node in a connected undirected graph."
    ),
    Problem(
        id=28,
        title="Course Schedule",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/course-schedule/",
        description="There are a total of numCourses courses you have to take."
    ),
    Problem(
        id=29,
        title="Pacific Atlantic Water Flow",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/pacific-atlantic-water-flow/",
        description="There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean."
    ),
    Problem(
        id=30,
        title="Number of Islands",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/number-of-islands/",
        description="Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water)."
    ),
    Problem(
        id=31,
        title="Longest Consecutive Sequence",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-consecutive-sequence/",
        description="Given an unsorted array of integers nums."
    ),
    Problem(
        id=32,
        title="Alien Dictionary",
        category="Graph",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/alien-dictionary/",
        description="There is a new alien language that uses the English alphabet."
    ),
    Problem(
        id=33,
        title="Graph Valid Tree",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/graph-valid-tree/",
        description="You have a graph of n nodes labeled from 0 to n - 1."
    ),
    Problem(
        id=34,
        title="Number of Connected Components in an Undirected Graph",
        category="Graph",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        description="You have a graph of n nodes."
    ),

    # Interval
    Problem(
        id=35,
        title="Insert Interval",
        category="Interval",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/insert-interval/",
        description="You are given an array of non-overlapping intervals."
    ),
    Problem(
        id=36,
        title="Merge Intervals",
        category="Interval",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/merge-intervals/",
        description="Given an array of intervals where intervals[i] = [starti, endi]."
    ),
    Problem(
        id=37,
        title="Non-overlapping Intervals",
        category="Interval",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/non-overlapping-intervals/",
        description="Given an array of intervals intervals."
    ),
    Problem(
        id=38,
        title="Meeting Rooms",
        category="Interval",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/meeting-rooms/",
        description="Given an array of meeting time intervals."
    ),
    Problem(
        id=39,
        title="Meeting Rooms II",
        category="Interval",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/meeting-rooms-ii/",
        description="Given an array of meeting time intervals."
    ),

    # Linked List
    Problem(
        id=40,
        title="Reverse a Linked List",
        category="Linked List",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/reverse-linked-list/",
        description="Given the head of a singly linked list, reverse the list."
    ),
    Problem(
        id=41,
        title="Detect Cycle in a Linked List",
        category="Linked List",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/linked-list-cycle/",
        description="Given head, the head of a linked list, determine if the linked list has a cycle in it."
    ),
    Problem(
        id=42,
        title="Merge Two Sorted Lists",
        category="Linked List",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/merge-two-sorted-lists/",
        description="You are given the heads of two sorted linked lists list1 and list2."
    ),
    Problem(
        id=43,
        title="Merge k Sorted Lists",
        category="Linked List",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/merge-k-sorted-lists/",
        description="You are given an array of k linked-lists lists."
    ),
    Problem(
        id=44,
        title="Remove Nth Node From End Of List",
        category="Linked List",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        description="Given the head of a linked list, remove the nth node from the end."
    ),
    Problem(
        id=45,
        title="Reorder List",
        category="Linked List",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/reorder-list/",
        description="You are given the head of a singly linked-list."
    ),

    # Matrix
    Problem(
        id=46,
        title="Set Matrix Zeroes",
        category="Matrix",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/set-matrix-zeroes/",
        description="Given an m x n integer matrix matrix."
    ),
    Problem(
        id=47,
        title="Spiral Matrix",
        category="Matrix",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/spiral-matrix/",
        description="Given an m x n matrix, return all elements of the matrix in spiral order."
    ),
    Problem(
        id=48,
        title="Rotate Image",
        category="Matrix",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/rotate-image/",
        description="You are given an n x n 2D matrix representing an image."
    ),
    Problem(
        id=49,
        title="Word Search",
        category="Matrix",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/word-search/",
        description="Given an m x n grid of characters board and a string word."
    ),

    # String
    Problem(
        id=50,
        title="Longest Substring Without Repeating Characters",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        description="Given a string s, find the length of the longest substring without repeating characters."
    ),
    Problem(
        id=51,
        title="Longest Repeating Character Replacement",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-repeating-character-replacement/",
        description="You are given a string s and an integer k."
    ),
    Problem(
        id=52,
        title="Minimum Window Substring",
        category="String",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/minimum-window-substring/",
        description="Given two strings s and t of lengths m and n respectively."
    ),
    Problem(
        id=53,
        title="Valid Anagram",
        category="String",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/valid-anagram/",
        description="Given two strings s and t, return true if t is an anagram of s."
    ),
    Problem(
        id=54,
        title="Group Anagrams",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/group-anagrams/",
        description="Given an array of strings strs, group the anagrams together."
    ),
    Problem(
        id=55,
        title="Valid Parentheses",
        category="String",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/valid-parentheses/",
        description="Given a string s containing just the characters '(', ')', '{', '}', '[' and ']'."
    ),
    Problem(
        id=56,
        title="Valid Palindrome",
        category="String",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/valid-palindrome/",
        description="A phrase is a palindrome if, after converting all uppercase letters into lowercase letters."
    ),
    Problem(
        id=57,
        title="Longest Palindromic Substring",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/longest-palindromic-substring/",
        description="Given a string s, return the longest palindromic substring in s."
    ),
    Problem(
        id=58,
        title="Palindromic Substrings",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/palindromic-substrings/",
        description="Given a string s, return the number of palindromic substrings in it."
    ),
    Problem(
        id=59,
        title="Encode and Decode Strings",
        category="String",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/encode-and-decode-strings/",
        description="Design an algorithm to encode a list of strings to a string."
    ),

    # Tree
    Problem(
        id=60,
        title="Maximum Depth of Binary Tree",
        category="Tree",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        description="Given the root of a binary tree, return its maximum depth."
    ),
    Problem(
        id=61,
        title="Same Tree",
        category="Tree",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/same-tree/",
        description="Given the roots of two binary trees p and q."
    ),
    Problem(
        id=62,
        title="Invert/Flip Binary Tree",
        category="Tree",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/invert-binary-tree/",
        description="Given the root of a binary tree, invert the tree."
    ),
    Problem(
        id=63,
        title="Binary Tree Maximum Path Sum",
        category="Tree",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        description="A path in a binary tree is a sequence of nodes."
    ),
    Problem(
        id=64,
        title="Binary Tree Level Order Traversal",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/binary-tree-level-order-traversal/",
        description="Given the root of a binary tree, return the level order traversal of its nodes' values."
    ),
    Problem(
        id=65,
        title="Serialize and Deserialize Binary Tree",
        category="Tree",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        description="Serialization is the process of converting a data structure or object into a sequence of bits."
    ),
    Problem(
        id=66,
        title="Subtree of Another Tree",
        category="Tree",
        difficulty="Easy",
        leetcode_url="https://leetcode.com/problems/subtree-of-another-tree/",
        description="Given the roots of two binary trees root and subRoot."
    ),
    Problem(
        id=67,
        title="Construct Binary Tree from Preorder and Inorder Traversal",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        description="Given two integer arrays preorder and inorder."
    ),
    Problem(
        id=68,
        title="Validate Binary Search Tree",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/validate-binary-search-tree/",
        description="Given the root of a binary tree, determine if it is a valid binary search tree (BST)."
    ),
    Problem(
        id=69,
        title="Kth Smallest Element in a BST",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        description="Given the root of a binary search tree, and an integer k."
    ),
    Problem(
        id=70,
        title="Lowest Common Ancestor of BST",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        description="Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes."
    ),
    Problem(
        id=71,
        title="Implement Trie (Prefix Tree)",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/implement-trie-prefix-tree/",
        description="A trie (pronounced as 'try') or prefix tree is a tree data structure."
    ),
    Problem(
        id=72,
        title="Add and Search Word",
        category="Tree",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        description="Design a data structure that supports adding new words and finding if a string matches any previously added string."
    ),
    Problem(
        id=73,
        title="Word Search II",
        category="Tree",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/word-search-ii/",
        description="Given an m x n board of characters and a list of strings words."
    ),

    # Heap
    Problem(
        id=74,
        title="Merge k Sorted Lists",
        category="Heap",
        difficulty="Hard",
        leetcode_url="https://leetcode.com/problems/merge-k-sorted-lists/",
        description="You are given an array of k linked-lists lists."
    ),
    Problem(
        id=75,
        title="Top K Frequent Elements",
        category="Heap",
        difficulty="Medium",
        leetcode_url="https://leetcode.com/problems/top-k-frequent-elements/",
        description="Given an integer array nums and an integer k."
    )
]

# In-memory storage for user progress (use database in production)
progress_data: Dict[str, UserProgress] = {}

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint with available endpoints information"""
    return {
        "message": "Blind75 Practice Backend API",
        "docs": "/docs",
        "endpoints": {
            "/problems": "GET - Get all problems",
            "/problems/{id}": "GET - Get specific problem",
            "/problems/category/{category}": "GET - Get problems by category",
            "/redirect/{id}": "GET - Redirect to LeetCode problem",
            "/categories": "GET - Get all categories",
            "/search": "GET - Search problems",
            "/progress/{user_id}": "GET - Get user progress",
            "/stats": "GET - Get overall statistics"
        }
    }

@app.get("/problems", response_model=ProblemListResponse, tags=["Problems"])
async def get_all_problems(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty")
):
    """Get all Blind75 problems with optional filters"""
    problems = BLIND75_PROBLEMS

    # Filter by category if specified
    if category:
        problems = [p for p in problems if p.category.lower() == category.lower()]

    # Filter by difficulty if specified
    if difficulty:
        problems = [p for p in problems if p.difficulty.lower() == difficulty.lower()]

    return ProblemListResponse(count=len(problems), problems=problems)

@app.get("/problems/{problem_id}", response_model=Problem, tags=["Problems"])
async def get_problem(problem_id: int):
    """Get a specific problem by ID"""
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    return problem

@app.get("/problems/category/{category}", response_model=CategoryResponse, tags=["Problems"])
async def get_problems_by_category(category: str):
    """Get all problems in a specific category"""
    problems = [p for p in BLIND75_PROBLEMS if p.category.lower() == category.lower()]

    if not problems:
        raise HTTPException(status_code=404, detail="Category not found")

    return CategoryResponse(
        category=category,
        count=len(problems),
        problems=problems
    )

@app.get("/redirect/{problem_id}", tags=["Redirect"])
async def redirect_to_leetcode(problem_id: int):
    """Redirect to the LeetCode problem page"""
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    return RedirectResponse(url=problem.leetcode_url, status_code=302)

@app.get("/categories", tags=["Categories"])
async def get_categories():
    """Get all unique categories with problem counts"""
    categories = list(set(problem.category for problem in BLIND75_PROBLEMS))
    category_counts = {}

    for category in categories:
        count = len([p for p in BLIND75_PROBLEMS if p.category == category])
        category_counts[category] = count

    return {
        "categories": sorted(categories),
        "category_counts": category_counts
    }

@app.get("/search", response_model=ProblemListResponse, tags=["Search"])
async def search_problems(q: str = Query(..., description="Search query")):
    """Search problems by title or description"""
    query = q.lower()

    matching_problems = [
        p for p in BLIND75_PROBLEMS 
        if query in p.title.lower() or query in p.description.lower()
    ]

    return ProblemListResponse(
        count=len(matching_problems),
        problems=matching_problems
    )

@app.get("/progress/{user_id}", response_model=UserProgress, tags=["Progress"])
async def get_user_progress(user_id: str):
    """Get user's progress"""
    if user_id not in progress_data:
        progress_data[user_id] = UserProgress(
            completed=[],
            attempted=[],
            total_problems=len(BLIND75_PROBLEMS)
        )

    return progress_data[user_id]

@app.post("/progress/{user_id}/complete/{problem_id}", response_model=ProgressResponse, tags=["Progress"])
async def mark_problem_complete(user_id: str, problem_id: int):
    """Mark a problem as completed"""
    if user_id not in progress_data:
        progress_data[user_id] = UserProgress(
            completed=[],
            attempted=[],
            total_problems=len(BLIND75_PROBLEMS)
        )

    # Check if problem exists
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    user_progress = progress_data[user_id]

    # Add to attempted if not already completed or attempted
    if (problem_id not in user_progress.completed and 
        problem_id not in user_progress.attempted):
        user_progress.attempted.append(problem_id)

    return ProgressResponse(
        message=f"Problem {problem_id} marked as attempted",
        progress=user_progress
    )

@app.get("/stats", response_model=StatsResponse, tags=["Statistics"])
async def get_stats():
    """Get overall statistics about the problems"""
    difficulty_counts = {}
    category_counts = {}

    for problem in BLIND75_PROBLEMS:
        # Count by difficulty
        diff = problem.difficulty
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1

        # Count by category
        cat = problem.category
        category_counts[cat] = category_counts.get(cat, 0) + 1

    return StatsResponse(
        total_problems=len(BLIND75_PROBLEMS),
        difficulty_distribution=difficulty_counts,
        category_distribution=category_counts
    )

@app.delete("/progress/{user_id}", tags=["Progress"])
async def reset_user_progress(user_id: str):
    """Reset user's progress"""
    if user_id in progress_data:
        del progress_data[user_id]

    return {"message": f"Progress reset for user {user_id}"}

@app.get("/problems/{problem_id}/similar", response_model=ProblemListResponse, tags=["Problems"])
async def get_similar_problems(problem_id: int, limit: int = Query(5, ge=1, le=10)):
    """Get similar problems based on category and difficulty"""
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Find problems with same category and difficulty, excluding the current problem
    similar_problems = [
        p for p in BLIND75_PROBLEMS 
        if p.id != problem_id and 
        (p.category == problem.category or p.difficulty == problem.difficulty)
    ]

    # Prioritize same category over same difficulty
    same_category = [p for p in similar_problems if p.category == problem.category]
    same_difficulty = [p for p in similar_problems if p.difficulty == problem.difficulty and p.category != problem.category]

    result = same_category + same_difficulty
    result = result[:limit]

    return ProblemListResponse(count=len(result), problems=result)

@app.post("/progress/{user_id}/complete/{problem_id}", response_model=ProgressResponse, tags=["Progress"])
async def mark_problem_complete(user_id: str, problem_id: int):
    """Mark a problem as completed"""
    if user_id not in progress_data:
        progress_data[user_id] = UserProgress(
            completed=[],
            attempted=[],
            total_problems=len(BLIND75_PROBLEMS)
        )

    # Check if problem exists
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    user_progress = progress_data[user_id]

    # Add to completed if not already there
    if problem_id not in user_progress.completed:
        user_progress.completed.append(problem_id)

    # Remove from attempted if it was there
    if problem_id in user_progress.attempted:
        user_progress.attempted.remove(problem_id)

    return ProgressResponse(
        message=f"Problem {problem_id} marked as completed",
        progress=user_progress
    )

if __name__ == "__main__":
    uvicorn.run(
        "blind75:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )

@app.post("/progress/{user_id}/attempt/{problem_id}", response_model=ProgressResponse, tags=["Progress"])
async def mark_problem_attempted(user_id: str, problem_id: int):
    """Mark a problem as attempted"""
    if user_id not in progress_data:
        progress_data[user_id] = UserProgress(
            completed=[],
            attempted=[],
            total_problems=len(BLIND75_PROBLEMS)
        )

    # Check if problem exists
    problem = next((p for p in BLIND75_PROBLEMS if p.id == problem_id), None)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")