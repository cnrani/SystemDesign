import pytest
from app.bloom_filter import BloomFilter

def test_bloom_filter_initialization():
    """Test Bloom Filter initialization with different parameters."""
    bf = BloomFilter(size=1000, false_positive_rate=0.01)
    assert bf.size == 1000
    assert bf.false_positive_rate == 0.01
    assert bf.num_hash_functions > 0
    assert bf.num_bits > 0
    assert bf.elements_added == 0

def test_add_and_check():
    """Test adding and checking elements."""
    bf = BloomFilter(size=1000, false_positive_rate=0.01)
    
    # Add elements
    test_elements = ["test1", "test2", "test3"]
    for element in test_elements:
        bf.add(element)
    
    # Check added elements
    for element in test_elements:
        assert bf.check(element) is True
    
    # Check non-existent elements
    non_existent = ["nonexistent1", "nonexistent2"]
    for element in non_existent:
        assert bf.check(element) is False

def test_false_positive_rate():
    """Test that false positive rate is within acceptable range."""
    bf = BloomFilter(size=1000, false_positive_rate=0.01)
    
    # Add some elements
    for i in range(100):
        bf.add(f"test{i}")
    
    # Check statistics
    stats = bf.get_stats()
    assert stats["elements_added"] == 100
    assert 0 <= stats["estimated_false_positive_rate"] <= 0.02  # Allow for some margin

def test_thread_safety():
    """Test thread safety of the Bloom Filter."""
    import threading
    
    bf = BloomFilter(size=1000, false_positive_rate=0.01)
    threads = []
    
    def add_elements():
        for i in range(100):
            bf.add(f"thread_test_{i}")
    
    # Create and start multiple threads
    for _ in range(10):
        thread = threading.Thread(target=add_elements)
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to complete
    for thread in threads:
        thread.join()
    
    # Verify all elements were added
    stats = bf.get_stats()
    assert stats["elements_added"] == 1000  # 10 threads * 100 elements each 