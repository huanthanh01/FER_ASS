const fs = require('fs');
const content = fs.readFileSync('components/shop/CategorySidebar.tsx', 'utf8');
let newContent = content.replace('import { AppColors } from ''../../constants/colors'';', 'import { AppColors } from ''../../constants/colors'';\nimport { useTheme } from ''../../constants/ThemeContext'';');
newContent = newContent.replace('export const CategorySidebar = ({ visible, activeCategory, onCategoryChange, onClose }: CategorySidebarProps) => {', 'export const CategorySidebar = ({ visible, activeCategory, onCategoryChange, onClose }: CategorySidebarProps) => {\n  const { colors, isDark } = useTheme();');
newContent = newContent.replace('color={AppColors.primaryOrange}', 'color={colors.primary}');
newContent = newContent.replace('dotActive: {\n    backgroundColor: AppColors.primaryOrange,\n  }', 'dotActive: {\n    backgroundColor: ''#FF6B00'', // We will override this in inline style\n  }');
fs.writeFileSync('components/shop/CategorySidebar.tsx', newContent);

