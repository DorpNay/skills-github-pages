from gateway.evals.run_local_model_benchmark import percentile, summarize


def test_percentile_uses_nearest_rank_and_handles_empty_samples():
    assert percentile([], 95) is None
    assert percentile([4.0, 1.0, 3.0, 2.0], 50) == 2.0
    assert percentile([4.0, 1.0, 3.0, 2.0], 95) == 4.0


def test_summary_reports_median_and_p95_without_inventing_empty_values():
    assert summarize([]) == {
        "count": 0, "min": None, "median": None, "p95": None, "max": None,
    }
    assert summarize([10.0, 30.0, 20.0]) == {
        "count": 3, "min": 10.0, "median": 20.0, "p95": 30.0, "max": 30.0,
    }
