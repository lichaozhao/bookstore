#!/bin/bash
# Copy users.json and books.json to test-users.json and test-books.json for test isolation
cp backend/data/users.json backend/data/test-users.json
cp backend/data/books.json backend/data/test-books.json
echo "Test data files created."
