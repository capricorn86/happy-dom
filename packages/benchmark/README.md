# Benchmarks

This package runs benchmarks comparing the local `happy-dom` package to `jsdom` in a variety of scenarios.

To see how your changes to the `happy-dom` package affect the benchmarks, follow these steps:

1. **Compile the `happy-dom` package:** Run this command from the root of the project:

    ```sh
    npm run compile -w happy-dom
    ```

2. **Run the benchmarks:** Run this command from the root of the project:

    ```sh
    npm run benchmark -w @happy-dom/benchmark
    ```

3. **Make your changes:** Modify the code in the `packages/happy-dom` directory.
4. **Benchmark again:** Repeat steps 1 and 2, then compare the new results to the original ones.
