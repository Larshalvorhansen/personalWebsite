# PCA Analysis: Norway's 500 Largest Companies

## Executive Summary

This report presents a Principal Component Analysis (PCA) of Norway's 500 largest companies, examining 17 financial, geographic, and sectoral features. The analysis reveals that **just 3 principal components explain 86% of the variance** in the dataset, indicating that Norwegian companies follow predictable patterns driven primarily by economic sector, profitability, and company maturity.

## Methodology

### Data Preparation

- **Dataset**: 495 Norwegian companies (after data cleaning)
- **Features analyzed**: 17 normalized variables including:
  - Financial metrics (revenue, assets, equity, profitability ratios)
  - Performance indicators (ROA, ROE, profit margin, asset turnover)
  - Company characteristics (age, employee count, profitability status)
  - Geographic data (distance from Oslo, municipality)
  - Sector classification (primary, secondary, tertiary scores)

### Preprocessing

- Missing values imputed using column means
- All features normalized to [0, 1] range using Min-Max scaling
- PCA performed on 17-dimensional normalized feature space

## Key Findings

### 1. Dimensionality Reduction

![Scree Plot](pca_visualizations/01_scree_plot.png)

**Variance Explained:**

- **PC1**: 45.3%
- **PC2**: 28.8%
- **PC3**: 11.7%
- **Cumulative (PC1-PC3)**: 85.8%

**Interpretation**: The high variance captured by the first three components suggests that Norwegian companies cluster into distinct groups with shared characteristics. This dimensionality reduction from 17 features to 3 components is highly efficient.

---

### 2. Principal Component Interpretations

#### PC1 (45.3%): Economic Sector Divide

**Key Loadings:**

- `is_profitable`: +0.63
- `sector_secondary_score`: +0.46
- `sector_tertiary_score`: -0.61

**Interpretation**: PC1 represents the fundamental divide between **profitable secondary sector companies** (manufacturing, industry, construction) on the positive side and **tertiary sector companies** (services, trade, finance) on the negative side.

**What this means**: The single largest source of variation among Norwegian companies is whether they operate in goods production versus service provision.

---

#### PC2 (28.8%): Company Maturity & Establishment

**Key Loadings:**

- `is_profitable`: +0.77
- `company_age`: +0.61
- `sector_tertiary_score`: +0.47
- `sector_secondary_score`: -0.42

**Interpretation**: PC2 distinguishes between **older, established, profitable service companies** and **newer secondary sector firms**. This axis captures company lifecycle and business model maturity.

**What this means**: Within each sector, age and profitability are strongly correlated. Older companies, particularly in services, tend to be more profitable.

---

#### PC3 (11.7%): Primary Sector Specialization

**Key Loadings:**

- `sector_primary_score`: +0.80
- `distance_from_oslo`: +0.94

**Interpretation**: PC3 isolates companies in the **primary sector** (oil & gas, fishing, aquaculture, agriculture) and their geographic distribution away from Oslo.

**What this means**: Resource extraction companies form a distinct category, often located far from the capital due to the nature of their operations (coastal fishing, offshore oil platforms, etc.).

---

### 3. Feature Contributions

![Loadings Heatmap](pca_visualizations/02_loadings_heatmap.png)

The loadings heatmap reveals several important patterns:

**Financial Size Metrics Cluster Together:**

- `total_assets`, `total_equity`, `most_recent_revenue`, `net_income` all load similarly
- These represent overall company scale

**Profitability Metrics Are Independent:**

- `roa` (Return on Assets) dominates PC8
- `roe` (Return on Equity) contributes to PC8
- These ratios capture efficiency independent of company size

**Sector Scores Define Early Components:**

- Sector classification strongly influences PC1, PC2, and PC3
- This confirms that economic sector is the primary differentiator

---

### 4. Company Clustering

![Biplot](pca_visualizations/03_biplot.png)

The biplot (PC1 vs PC2) shows clear clustering patterns:

**Profitable Companies (green dots)**:

- Cluster in the **upper-right quadrant**
- High scores on both PC1 and PC2
- Tend to be established firms in either secondary or mature tertiary sectors

**Unprofitable Companies (red dots)**:

- Scattered across **bottom-left**
- Negative PC1 (tertiary sector) and negative PC2 (newer/struggling)

**Feature Vector Insights**:

- `is_profitable` arrow points upper-right → profitability correlates with both sector type and maturity
- `sector_tertiary_score` points left → services dominate the negative PC1 space
- `sector_primary_score` points down-right → resource companies occupy unique space
- `company_age` points upward → older companies score higher on PC2

**Central Clustering**: Most companies cluster near the origin, representing "typical" Norwegian firms with average characteristics across all dimensions.

---

### 5. Sector Separation

![Sector Clustering](pca_visualizations/05_sector_clustering.png)

When companies are colored by their dominant economic sector, clear separation emerges:

**Tertiary Sector (Green - Services)**:

- Forms two distinct clusters:
  - **Upper-left**: Older, established service companies
  - **Center-top**: Newer service businesses
- Represents the majority of Norwegian companies

**Secondary Sector (Blue - Manufacturing/Industry)**:

- Spreads across **bottom-right** quadrant
- Shows more variation in maturity and profitability
- Includes construction, production, and industrial firms

**Primary Sector (Brown/Red - Resources)**:

- Distinct cluster on **right side**
- Includes oil & gas, fishing, aquaculture
- Geographically dispersed (high distance from Oslo)

---

## Business Insights

### 1. Norwegian Economy Structure

The clear sectoral separation confirms Norway's economic composition:

- **Services dominate** numerically (tertiary sector)
- **Secondary sector shows high variance** - some very successful, others struggling
- **Primary sector is unique** - driven by natural resource extraction

### 2. Profitability Patterns

- **Age correlates with profitability**, especially in services
- Newer companies across all sectors face profitability challenges
- Established service companies are the most consistently profitable

### 3. Geographic Influence

- Primary sector companies located far from Oslo (coastal operations, offshore platforms)
- Distance from Oslo captured as its own dimension (PC3, PC5)
- Most other sectors cluster around urban centers

### 4. Size vs. Efficiency

- Company size metrics (revenue, assets) cluster together
- Efficiency metrics (ROA, ROE) independent of size
- Large companies aren't necessarily more profitable per unit of assets

---

## Statistical Summary

| Metric                                 | Value     |
| -------------------------------------- | --------- |
| Total companies analyzed               | 495       |
| Features included                      | 17        |
| Variance explained (PC1-3)             | 85.8%     |
| Profitable companies                   | 53.9%     |
| Average distance from Oslo             | 140.7 km  |
| Companies with complete financial data | 327 (66%) |

---

## Conclusions

1. **Economic sector is the primary differentiator** among Norwegian companies, explaining 45% of variance
2. **Company maturity and profitability are strongly linked**, particularly in the service sector
3. **Primary sector companies are fundamentally different** from other businesses, driven by geography and resource availability
4. **Most companies cluster around typical characteristics**, with relatively few outliers
5. **Three dimensions capture 86% of variation**, suggesting Norwegian companies follow predictable patterns

---

## Recommendations for Further Analysis

1. **Outlier Investigation**: Examine companies far from cluster centers to identify unique business models
2. **Industry-Level Analysis**: Drill down into specific industries within each sector
3. **Temporal Analysis**: Compare PCA results across different years to identify structural changes
4. **Profitability Modeling**: Use PC scores as features to predict future profitability
5. **Regional Clustering**: Analyze if municipalities show distinct economic patterns beyond the Oslo divide

---

## Technical Appendix

### Files Generated

- `companiesPCA` table in SQLite database with PC scores for all companies
- PNG visualizations in `pca_visualizations/` directory
- Interactive HTML report with 2D and 3D scatter plots

### Software Used

- Python 3.12
- scikit-learn 1.3+ (PCA implementation)
- pandas 2.2+ (data manipulation)
- matplotlib & seaborn (static visualizations)
- plotly (interactive visualizations)

### Reproducibility

All code and data are available. The analysis can be reproduced by running:

```bash
python normalizeData.py  # Data preprocessing
python pca_analysis.py   # PCA execution
```

---

_Analysis completed: October 2025_  
_Dataset: Norway's 500 largest companies (2024-2025 data)_
