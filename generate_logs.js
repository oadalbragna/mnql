import fs from 'fs';
import path from 'path';

const componentsDir = './components';
const logsDir = './.logs';

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    const name = file.replace('.tsx', '');
    
    // استخراج الإضافات (المكتبات الخارجية)
    const imports = [];
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        if (!match[1].startsWith('.')) {
            imports.push(match[1]);
        }
    }
    
    // استخراج الميزات الأساسية من خلال الأيقونات المستخدمة (دليل على الوظائف)
    let features = [];
    const iconRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
    let iconMatch = iconRegex.exec(content);
    if (iconMatch) {
        features = iconMatch[1].split(',').map(s => s.trim().replace(/\s+as\s+.*$/, '')).filter(Boolean);
    }

    // تلخيص المعلومات
    const summary = `اسم الصفحة: ${name}

الوصف والموجز: 
تمثل هذه الصفحة/المكون جزءاً من واجهة مستخدم تطبيق "سوق المناقل الرقمي". تعمل على توفير وظائف متخصصة للمستخدمين لعرض وتفاعل مع المنصة.

الإضافات والاعتمادات (المكتبات المستخدمة):
${[...new Set(imports)].join('\n- ') || 'لا يوجد مكتبات خارجية إضافية'}

الميزات والوظائف المتوفرة في الصفحة:
- ${features.length > 0 ? features.join('\n- ') : 'عرض واجهة مستخدم تفاعلية'}

تفاصيل إضافية: 
تم تصميم الصفحة لتكون متجاوبة (Responsive) وسريعة الأداء.
`;

    fs.writeFileSync(path.join(logsDir, `${name}.txt`), summary.trim());
});

console.log('تمت العملية بنجاح! تم استخراج جميع معلومات الصفحات وتخزينها في مجلد .logs');
