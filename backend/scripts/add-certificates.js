const { query } = require('../src/lib/db');
const crypto = require('crypto');

async function addTestCertificates() {
  try {
    console.log('Adding test certificates...');

    // Get existing users and courses
    const usersResult = await query('SELECT id, name, email FROM users WHERE role = $1', ['STUDENT']);
    const coursesResult = await query('SELECT id, title FROM courses LIMIT 3');
    const authorsResult = await query('SELECT id, name FROM authors LIMIT 1');

    if (usersResult.rows.length === 0 || coursesResult.rows.length === 0) {
      console.log('No users or courses found. Please run seed script first.');
      return;
    }

    const user = usersResult.rows[0];
    const courses = coursesResult.rows;
    const author = authorsResult.rows[0];

    // Create test certificates
    const certificates = [
      {
        title: 'Сертифицированный Налоговый консультант по вопросам имущества',
        description: 'Данный сертификат подтверждает успешное прохождение курса по налогообложению имущества и получение квалификации налогового консультанта.',
        certificate_type: 'COMPLETION',
        instructor_name: author.name,
        completion_date: '2024-01-20',
        certificate_number: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        verification_code: crypto.randomBytes(8).toString('hex').toUpperCase(),
        status: 'ACTIVE'
      },
      {
        title: 'Специалист по НДС для бизнеса',
        description: 'Сертификат о прохождении курса по налогу на добавленную стоимость для предпринимателей.',
        certificate_type: 'ACHIEVEMENT',
        instructor_name: author.name,
        completion_date: '2024-02-15',
        certificate_number: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        verification_code: crypto.randomBytes(8).toString('hex').toUpperCase(),
        status: 'ACTIVE'
      },
      {
        title: 'Эксперт по налоговому планированию',
        description: 'Сертификат о получении квалификации эксперта по налоговому планированию и оптимизации.',
        certificate_type: 'COMPLETION',
        instructor_name: author.name,
        completion_date: '2024-03-10',
        certificate_number: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        verification_code: crypto.randomBytes(8).toString('hex').toUpperCase(),
        status: 'ACTIVE'
      }
    ];

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      const course = courses[i % courses.length];
      
      const shareUrl = `http://localhost:3000/certificates/verify/${cert.verification_code}`;
      const certificateUrl = `/certificates/${user.id}_${course.id}_${Date.now()}.pdf`;
      const pdfUrl = `/api/certificates/${user.id}_${course.id}_${Date.now()}.pdf`;

      const insertQuery = `
        INSERT INTO certificates (
          user_id, course_id, title, description, certificate_type,
          instructor_name, completion_date, certificate_number, verification_code,
          certificate_url, pdf_url, share_url, status, issued_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const result = await query(insertQuery, [
        user.id, course.id, cert.title, cert.description, cert.certificate_type,
        cert.instructor_name, cert.completion_date, cert.certificate_number, cert.verification_code,
        certificateUrl, pdfUrl, shareUrl, cert.status, new Date()
      ]);

      console.log(`Created certificate: ${result.rows[0].title}`);
    }

    console.log('Test certificates added successfully!');
  } catch (error) {
    console.error('Error adding test certificates:', error);
  }
}

// Run the script
addTestCertificates().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
