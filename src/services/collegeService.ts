// College Service - Backend-like functionality for handling college data
// This service simulates backend operations and can be easily replaced with actual API calls

interface CollegeData {
  colleges: string[];
}

class CollegeService {
  private collegeData: CollegeData | null = null;
  private isLoading = false;
  private cache: string[] = [];

  constructor() {
    // Initialize with loading college data
    this.loadColleges();
  }

  /**
   * Load colleges from data source (simulates backend call)
   * In real implementation, this would fetch from your Excel/database
   */
  private async loadColleges(): Promise<void> {
    if (this.isLoading || this.collegeData) return;
    
    this.isLoading = true;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Import college data (simulating Excel data from Column B)
      const { collegeDatabase } = await import('../data/colleges');
      this.collegeData = { colleges: collegeDatabase };
      this.cache = collegeDatabase;
      
      console.log(`🎓 Loaded ${this.cache.length} colleges from database`);
    } catch (error) {
      console.error('Error loading college data:', error);
      // Fallback to empty array if data loading fails
      this.cache = [];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get all colleges
   */
  async getAllColleges(): Promise<string[]> {
    await this.ensureDataLoaded();
    return [...this.cache]; // Return copy to prevent mutation
  }

  /**
   * Search colleges by name (case-insensitive, partial match)
   */
  async searchColleges(searchTerm: string, limit: number = 10): Promise<string[]> {
    await this.ensureDataLoaded();
    
    if (!searchTerm.trim()) {
      return this.cache.slice(0, limit);
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Enhanced search algorithm
    const results = this.cache.filter(college => {
      const normalizedCollege = college.toLowerCase();
      
      // Priority search: exact start match, then contains match
      return normalizedCollege.includes(normalizedSearch);
    });

    // Sort by relevance: exact matches first, then starts with, then contains
    results.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Exact match priority
      if (aLower === normalizedSearch) return -1;
      if (bLower === normalizedSearch) return 1;
      
      // Starts with priority
      const aStartsWith = aLower.startsWith(normalizedSearch);
      const bStartsWith = bLower.startsWith(normalizedSearch);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;
      
      // Alphabetical order for same priority
      return a.localeCompare(b);
    });

    return results.slice(0, limit);
  }

  /**
   * Add a new college (simulates backend addition)
   * In real implementation, this would call an API to add to Excel/database
   */
  async addCollege(collegeName: string): Promise<boolean> {
    await this.ensureDataLoaded();
    
    const trimmedName = collegeName.trim();
    
    // Check if college already exists (case-insensitive)
    const exists = this.cache.some(college => 
      college.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (!exists && trimmedName) {
      this.cache.push(trimmedName);
      this.cache.sort(); // Keep sorted
      
      // In real implementation, you would call API to save to Excel/database
      console.log(`🎓 Added new college: ${trimmedName}`);
      
      // Simulate saving to backend
      await this.saveToBackend(trimmedName);
      
      return true;
    }
    
    return false;
  }

  /**
   * Get college suggestions based on partial input
   */
  async getSuggestions(partialName: string, limit: number = 5): Promise<string[]> {
    return this.searchColleges(partialName, limit);
  }

  /**
   * Check if a college exists in the database
   */
  async collegeExists(collegeName: string): Promise<boolean> {
    await this.ensureDataLoaded();
    
    return this.cache.some(college => 
      college.toLowerCase() === collegeName.toLowerCase().trim()
    );
  }

  /**
   * Get colleges by state/region (if location data is available)
   */
  async getCollegesByRegion(region: string): Promise<string[]> {
    await this.ensureDataLoaded();
    
    const normalizedRegion = region.toLowerCase();
    
    return this.cache.filter(college => 
      college.toLowerCase().includes(normalizedRegion)
    );
  }

  /**
   * Get total count of colleges
   */
  async getCollegeCount(): Promise<number> {
    await this.ensureDataLoaded();
    return this.cache.length;
  }

  /**
   * Simulate Excel integration - In real implementation, this would:
   * 1. Connect to your Excel file "All India Colleges"
   * 2. Read from Column B
   * 3. Parse and return the data
   */
  async loadFromExcel(): Promise<string[]> {
    // This method represents where you would integrate with your actual Excel file
    console.log('📊 Loading colleges from Excel file "All India Colleges", Column B...');
    
    // Simulate Excel reading process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation:
    // 1. Use a library like 'xlsx' or 'exceljs' to read the Excel file
    // 2. Extract data from Column B
    // 3. Clean and format the data
    // 4. Return the college list
    
    return this.getAllColleges();
  }

  /**
   * Save new college to backend/Excel (simulation)
   */
  private async saveToBackend(collegeName: string): Promise<void> {
    // Simulate saving to Excel/database
    console.log(`💾 Saving "${collegeName}" to Excel file...`);
    
    // In real implementation, this would:
    // 1. Open the Excel file "All India Colleges"
    // 2. Add the new college name to Column B
    // 3. Save the file
    // 4. Update any database if applicable
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  /**
   * Ensure college data is loaded before operations
   */
  private async ensureDataLoaded(): Promise<void> {
    if (!this.collegeData && !this.isLoading) {
      await this.loadColleges();
    }
    
    // Wait for loading to complete if it's in progress
    while (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Refresh college data from source (simulates re-reading Excel)
   */
  async refreshData(): Promise<void> {
    this.collegeData = null;
    this.cache = [];
    await this.loadColleges();
  }

  /**
   * Export current college list (simulates Excel export)
   */
  async exportToExcel(): Promise<string[]> {
    await this.ensureDataLoaded();
    console.log('📤 Exporting college list for Excel integration...');
    return this.getAllColleges();
  }
}

// Create singleton instance
export const collegeService = new CollegeService();

// Export types for TypeScript
export type { CollegeData };

// Utility functions for direct use
export const searchColleges = (searchTerm: string, limit?: number) => 
  collegeService.searchColleges(searchTerm, limit);

export const getAllColleges = () => 
  collegeService.getAllColleges();

export const addCollege = (collegeName: string) => 
  collegeService.addCollege(collegeName);

export const collegeExists = (collegeName: string) => 
  collegeService.collegeExists(collegeName);