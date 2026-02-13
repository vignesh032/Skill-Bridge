# TODO: Dashboard Links & Theme Update

## Changes Required:
1. [ ] Update script.js - Change dashboard card links to navigate to HTML pages
2. [ ] Update index.html - Change sidebar navigation to link to HTML pages
3. [ ] Update style.css - Change color theme from cyan/blue to orange

## Detailed Changes:

### 1. script.js
- Change Skill Analysis card from `loadContent('skills')` to navigate to `skills-analysis.html`
- Change Resume Builder card from `loadContent('resume')` to navigate to `resume.html`

### 2. index.html  
- Update sidebar buttons to use window.location.href instead of loadContent for Skill Analysis and Resume Tracker

### 3. style.css
- Change primary color from #22D3EE (cyan) to #FF8C00 (orange)
- Change secondary color from #3B82F6 (blue) to #FF6B00 (darker orange)
- Update all gradient backgrounds to use orange tones
- Update all text highlights and accents to orange
