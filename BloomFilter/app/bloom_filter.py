import mmh3
import numpy as np
import math
from typing import List, Optional
import threading

class BloomFilter:
    def __init__(self, size: int, false_positive_rate: float):
        """
        Initialize the Bloom Filter with given size and false positive rate.
        
        Args:
            size (int): Expected number of elements to be stored
            false_positive_rate (float): Desired false positive rate
        """
        self.size = size
        self.false_positive_rate = false_positive_rate
        
        # Calculate optimal number of hash functions and bits
        self.num_hash_functions = self._calculate_num_hash_functions()
        self.num_bits = self._calculate_num_bits()
        
        # Initialize bit array
        self.bit_array = np.zeros(self.num_bits, dtype=bool)
        
        # Thread lock for thread safety
        self.lock = threading.Lock()
        
        # Statistics
        self.elements_added = 0
        
    def _calculate_num_hash_functions(self) -> int:
        """Calculate optimal number of hash functions."""
        return int(-math.log2(self.false_positive_rate))
    
    def _calculate_num_bits(self) -> int:
        """Calculate optimal number of bits."""
        return int(-(self.size * math.log(self.false_positive_rate)) / (math.log(2) ** 2))
    
    def _get_hash_values(self, element: str) -> List[int]:
        """Get hash values for an element using different seeds."""
        return [mmh3.hash(element, seed=i) % self.num_bits for i in range(self.num_hash_functions)]
    
    def add(self, element: str) -> None:
        """
        Add an element to the Bloom Filter.
        
        Args:
            element (str): Element to add
        """
        with self.lock:
            hash_values = self._get_hash_values(element)
            for hash_value in hash_values:
                self.bit_array[hash_value] = True
            self.elements_added += 1
    
    def check(self, element: str) -> bool:
        """
        Check if an element might be in the Bloom Filter.
        
        Args:
            element (str): Element to check
            
        Returns:
            bool: True if element might be present, False if definitely not present
        """
        hash_values = self._get_hash_values(element)
        return all(self.bit_array[hash_value] for hash_value in hash_values)
    
    def get_stats(self) -> dict:
        """
        Get current statistics of the Bloom Filter.
        
        Returns:
            dict: Statistics including size, false positive rate, and elements added
        """
        return {
            "size": self.size,
            "false_positive_rate": self.false_positive_rate,
            "num_hash_functions": self.num_hash_functions,
            "num_bits": self.num_bits,
            "elements_added": self.elements_added,
            "estimated_false_positive_rate": self._calculate_actual_false_positive_rate()
        }
    
    def _calculate_actual_false_positive_rate(self) -> float:
        """Calculate the actual false positive rate based on current state."""
        if self.elements_added == 0:
            return 0.0
        return (1 - math.exp(-self.num_hash_functions * self.elements_added / self.num_bits)) ** self.num_hash_functions 