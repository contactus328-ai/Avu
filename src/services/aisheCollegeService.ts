// AISHE College Service - Optimized for 70,000+ colleges
// This service is designed to handle large datasets efficiently with advanced search and filtering

interface AISHECollege {
  id: string;
  name: string;
  state: string;
  district: string;
  university: string;
  type: 'Affiliated' | 'Constituent' | 'Autonomous' | 'University' | 'Other';
  category: string;
  establishmentYear?: number;
}

class AISHECollegeService {
  private colleges: AISHECollege[] = [];
  private searchIndex: Map<string, AISHECollege[]> = new Map();
  private isLoaded = false;
  private isLoading = false;

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the service with sample data
   * Replace this with actual AISHE data loading
   */
  private async initializeService(): Promise<void> {
    if (this.isLoading || this.isLoaded) return;
    
    this.isLoading = true;
    
    try {
      // Load sample data (replace with actual AISHE data)
      await this.loadSampleData();
      this.buildSearchIndex();
      this.isLoaded = true;
      console.log(`🎓 AISHE Service: Loaded ${this.colleges.length} colleges`);
    } catch (error) {
      console.error('Error initializing AISHE service:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load sample data - Replace this with actual AISHE data loader
   */
  private async loadSampleData(): Promise<void> {
    // This is sample data - replace with actual AISHE data
    const sampleColleges: AISHECollege[] = [
      // Mumbai Colleges
      { id: 'aishe_001', name: 'St. Xavier\'s College, Mumbai', state: 'Maharashtra', district: 'Mumbai', university: 'University of Mumbai', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_002', name: 'Jai Hind College, Mumbai', state: 'Maharashtra', district: 'Mumbai', university: 'University of Mumbai', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_003', name: 'H.R. College of Commerce and Economics, Mumbai', state: 'Maharashtra', district: 'Mumbai', university: 'University of Mumbai', type: 'Affiliated', category: 'Commerce' },
      { id: 'aishe_004', name: 'Mithibai College, Mumbai', state: 'Maharashtra', district: 'Mumbai', university: 'University of Mumbai', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_005', name: 'K.C. College, Mumbai', state: 'Maharashtra', district: 'Mumbai', university: 'University of Mumbai', type: 'Affiliated', category: 'Arts & Science' },
      
      // Delhi Colleges
      { id: 'aishe_006', name: 'St. Stephen\'s College, Delhi', state: 'Delhi', district: 'New Delhi', university: 'University of Delhi', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_007', name: 'Hindu College, Delhi', state: 'Delhi', district: 'New Delhi', university: 'University of Delhi', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_008', name: 'Lady Shri Ram College for Women, Delhi', state: 'Delhi', district: 'New Delhi', university: 'University of Delhi', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_009', name: 'Shri Ram College of Commerce, Delhi', state: 'Delhi', district: 'New Delhi', university: 'University of Delhi', type: 'Affiliated', category: 'Commerce' },
      { id: 'aishe_010', name: 'Miranda House, Delhi', state: 'Delhi', district: 'New Delhi', university: 'University of Delhi', type: 'Affiliated', category: 'Arts & Science' },
      
      // Bangalore Colleges
      { id: 'aishe_011', name: 'Christ University, Bangalore', state: 'Karnataka', district: 'Bangalore Urban', university: 'Christ University', type: 'University', category: 'Multi-disciplinary' },
      { id: 'aishe_012', name: 'St. Joseph\'s College, Bangalore', state: 'Karnataka', district: 'Bangalore Urban', university: 'Bangalore University', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_013', name: 'Mount Carmel College, Bangalore', state: 'Karnataka', district: 'Bangalore Urban', university: 'Bangalore University', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_014', name: 'Presidency College, Bangalore', state: 'Karnataka', district: 'Bangalore Urban', university: 'Bangalore University', type: 'Affiliated', category: 'Arts & Science' },
      
      // Chennai Colleges
      { id: 'aishe_015', name: 'Loyola College, Chennai', state: 'Tamil Nadu', district: 'Chennai', university: 'University of Madras', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_016', name: 'Stella Maris College, Chennai', state: 'Tamil Nadu', district: 'Chennai', university: 'University of Madras', type: 'Affiliated', category: 'Arts & Science' },
      { id: 'aishe_017', name: 'Presidency College, Chennai', state: 'Tamil Nadu', district: 'Chennai', university: 'University of Madras', type: 'Affiliated', category: 'Arts & Science' },
      
      // Engineering Colleges
      { id: 'aishe_018', name: 'Indian Institute of Technology Bombay', state: 'Maharashtra', district: 'Mumbai', university: 'IIT Bombay', type: 'University', category: 'Engineering & Technology' },
      { id: 'aishe_019', name: 'Indian Institute of Technology Delhi', state: 'Delhi', district: 'New Delhi', university: 'IIT Delhi', type: 'University', category: 'Engineering & Technology' },
      { id: 'aishe_020', name: 'Indian Institute of Technology Madras', state: 'Tamil Nadu', district: 'Chennai', university: 'IIT Madras', type: 'University', category: 'Engineering & Technology' },
      
      // Add more sample data representing different states
      ...Array.from({ length: 80 }, (_, i) => ({
        id: `aishe_${(21 + i).toString().padStart(3, '0')}`,
        name: `Sample College ${i + 1}, ${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Kolkata', 'Hyderabad'][i % 7]}`,
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'West Bengal', 'Telangana'][i % 7],
        district: ['Mumbai', 'New Delhi', 'Bangalore Urban', 'Chennai', 'Pune', 'Kolkata', 'Hyderabad'][i % 7],
        university: `University ${i + 1}`,
        type: ['Affiliated', 'Constituent', 'Autonomous'][i % 3] as any,
        category: ['Arts & Science', 'Commerce', 'Engineering & Technology', 'Medical', 'Management'][i % 5]
      }))
    ];

    this.colleges = sampleColleges;
  }

  /**
   * Build search index for fast searching
   */
  private buildSearchIndex(): void {
    this.searchIndex.clear();
    
    this.colleges.forEach(college => {
      // Index by first few characters for efficient prefix search
      const name = college.name.toLowerCase();
      for (let i = 1; i <= Math.min(name.length, 5); i++) {
        const prefix = name.substring(0, i);
        if (!this.searchIndex.has(prefix)) {
          this.searchIndex.set(prefix, []);
        }
        this.searchIndex.get(prefix)!.push(college);
      }
    });
  }

  /**
   * Search colleges with optimized performance for large datasets
   */
  async searchColleges(query: string, limit: number = 20): Promise<string[]> {
    await this.ensureLoaded();
    
    if (!query.trim()) {
      return this.colleges.slice(0, limit).map(c => c.name);
    }

    const normalizedQuery = query.toLowerCase().trim();
    let results: AISHECollege[] = [];

    // Use index for efficient prefix search
    if (this.searchIndex.has(normalizedQuery)) {
      results = this.searchIndex.get(normalizedQuery)!;
    } else {
      // Fallback to linear search for complex queries
      results = this.colleges.filter(college =>
        college.name.toLowerCase().includes(normalizedQuery)
      );
    }

    // Sort by relevance
    results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match first
      if (aName === normalizedQuery) return -1;
      if (bName === normalizedQuery) return 1;
      
      // Starts with query
      const aStarts = aName.startsWith(normalizedQuery);
      const bStarts = bName.startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
      
      // Alphabetical
      return a.name.localeCompare(b.name);
    });

    return results.slice(0, limit).map(c => c.name);
  }

  /**
   * Get colleges by state
   */
  async getCollegesByState(state: string): Promise<string[]> {
    await this.ensureLoaded();
    return this.colleges
      .filter(c => c.state.toLowerCase() === state.toLowerCase())
      .map(c => c.name);
  }

  /**
   * Get colleges by type (Affiliated, Constituent, etc.)
   */
  async getCollegesByType(type: string): Promise<string[]> {
    await this.ensureLoaded();
    return this.colleges
      .filter(c => c.type.toLowerCase() === type.toLowerCase())
      .map(c => c.name);
  }

  /**
   * Get total count
   */
  async getCollegeCount(): Promise<number> {
    await this.ensureLoaded();
    return this.colleges.length;
  }

  /**
   * Add a new college (for user additions)
   */
  async addCollege(collegeName: string): Promise<boolean> {
    await this.ensureLoaded();
    
    // Check if already exists
    if (this.colleges.some(c => c.name.toLowerCase() === collegeName.toLowerCase())) {
      return false;
    }

    const newCollege: AISHECollege = {
      id: `user_${Date.now()}`,
      name: collegeName,
      state: 'Unknown',
      district: 'Unknown',
      university: 'Unknown',
      type: 'Other',
      category: 'Unknown'
    };

    this.colleges.push(newCollege);
    this.buildSearchIndex(); // Rebuild index
    return true;
  }

  /**
   * Load AISHE data from JSON file or API
   * Replace this with actual AISHE data loading
   */
  async loadFromAISHE(data: any[]): Promise<void> {
    console.log('🔄 Loading AISHE data...');
    
    // Transform AISHE data to our format
    const transformedColleges: AISHECollege[] = data.map((item, index) => ({
      id: `aishe_${index}`,
      name: item.collegeName || item.name || 'Unknown College',
      state: item.state || 'Unknown',
      district: item.district || 'Unknown',
      university: item.university || item.affiliatedTo || 'Unknown',
      type: item.type || 'Affiliated',
      category: item.category || 'Unknown',
      establishmentYear: item.establishmentYear
    }));

    this.colleges = transformedColleges;
    this.buildSearchIndex();
    this.isLoaded = true;
    
    console.log(`✅ Loaded ${this.colleges.length} colleges from AISHE data`);
  }

  /**
   * Export college names for external use
   */
  async exportCollegeNames(): Promise<string[]> {
    await this.ensureLoaded();
    return this.colleges.map(c => c.name);
  }

  private async ensureLoaded(): Promise<void> {
    if (!this.isLoaded && !this.isLoading) {
      await this.initializeService();
    }
    
    while (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}

// Create singleton instance
export const aisheCollegeService = new AISHECollegeService();

export default aisheCollegeService;