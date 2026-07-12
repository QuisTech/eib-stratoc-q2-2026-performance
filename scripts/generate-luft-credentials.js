const fs = require('fs');

const LUFT_PAYTV_STAFF = [
  { first: "Micheal", middle: "Isaac", last: "Adekunle", position: "Video Editor", empId: "EIB6926" },
  { first: "Nefisat", middle: "Ojimaojo", last: "Mohammed", position: "HR Officer", empId: "EIN9516" },
  { first: "Numve", middle: "Terwase", last: "Richard", position: "Video Editor", empId: "EIB5787" },
  { first: "Michael", middle: "Roland", last: "okwumbu", position: "Video Editor", empId: "EIB1202" },
  { first: "John", middle: "Oloruntoba", last: "Kutus", position: "Video Editor", empId: "EIB4986" },
  { first: "Chris", middle: "Anayo", last: "Ugwu", position: "Video Editor", empId: "EIB5689" },
  { first: "Daniel", middle: "Ogbeche", last: "Elaigwu", position: "Graphic Designers", empId: "EIB1684" },
  { first: "Francis", middle: "Tiah", last: "Obi", position: "Graphic Designers", empId: "EIB1658" },
  { first: "Gabriel", middle: "Ileanaju", last: "Okpetu", position: "Video Editor", empId: "EIB2268" },
  { first: "Udeagwu", middle: "Judith", last: "Ugomma", position: "Supervisor CSR Owerri", empId: "EIB8125" },
  { first: "Barnabas", middle: "", last: "Geofrey", position: "Teamlead CSR JOS", empId: "EIB7699" },
  { first: "Aisha", middle: "Abdullahi", last: "Muhammad", position: "CSR KANO", empId: "EIB3653" },
  { first: "Blessing", middle: "", last: "Julius", position: "Media and Coorperate comm", empId: "EIB2785" },
  { first: "Joseph", middle: "", last: "Enoch", position: "Media and Coorperate comm", empId: "EIB2334" },
  { first: "Ehiemere", middle: "Samuel", last: "Emeka", position: "PGA", empId: "EIB2653" },
  { first: "Goodnews", middle: "Emmanuel", last: "Joseph", position: "PGA", empId: "EIB1309" },
  { first: "kefas", middle: "wando", last: "Rita", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/072" },
  { first: "Yacit", middle: "Sunday", last: "Lipdo", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/052" },
  { first: "Haruna", middle: "Jovial", last: "Jonathan", position: "PGA", empId: "EIB6975" },
  { first: "Christopher", middle: "Chikezie", last: "Nwosu", position: "Warehouse Officer", empId: "EIB6616" },
  { first: "Prestige", middle: "", last: "Maduka", position: "Sales Point", empId: "EIB6114" },
  { first: "Lydia", middle: "Anave", last: "Ohikere", position: "Social Media manager", empId: "EIB9277" },
  { first: "Emmanuel", middle: "Eme", last: "Uduma", position: "PGA", empId: "EIB4547" },
  { first: "CHINWE", middle: "", last: "CHINECHEREM", position: "PGA", empId: "" },
  { first: "Amedu", middle: "Aboshoke", last: "Pricillia", position: "Sales Point", empId: "Luf/paytv/Emp/SN3/045" },
  { first: "Godspower", middle: "Yinka", last: "Ibitayo", position: "Sales Point", empId: "EIB5709" },
  { first: "OGECHUKWU", middle: "PETER", last: "ALAEBO", position: "PGA", empId: "EIB8723" },
  { first: "SHARON", middle: "CHIDINMA", last: "OGUJIOFOR", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/084" },
  { first: "ELIZABETH", middle: "OGOMUEGBUNAM", last: "NWAFOR", position: "CSR LAGOS", empId: "EIB8660" },
  { first: "Terkula", middle: "", last: "Orngu", position: "Security officer", empId: "EIB1673" },
  { first: "Joshua", middle: "Nathaniel", last: "Ehat", position: "Security officer", empId: "EIB3888" },
  { first: "Abraham", middle: "", last: "Aigbose", position: "Security officer", empId: "EIB1409" },
  { first: "Luka", middle: "Wisdom", last: "Tatumari", position: "Security officer", empId: "EIB4058" },
  { first: "Blessing", middle: "Zangata", last: "Aruwa", position: "Security officer", empId: "EIB7818" },
  { first: "Treasure", middle: "Mercy", last: "Chicha", position: "Marketing and Commercials", empId: "EIB2864" },
  { first: "Fidelis", middle: "", last: "Zakka", position: "Driver", empId: "EIB2096" },
  { first: "Sylvester", middle: "Ngala", last: "Madaki", position: "Security officer", empId: "EIB8450" },
  { first: "Joy", middle: "", last: "Adamu", position: "Security officer", empId: "EIB7818" },
  { first: "Inalegwu", middle: "", last: "Ajeibi", position: "Security officer", empId: "EIB8790" },
  { first: "Awuha", middle: "Alex", last: "Swen", position: "Security officer", empId: "EIB8865" },
  { first: "Shuaibu", middle: "", last: "Muhammed", position: "Driver", empId: "EIB8242" },
  { first: "Aliyu", middle: "Huzaifa", last: "Adamu", position: "Security officer", empId: "EIB4913" },
  { first: "Godwin", middle: "Uwhalogho", last: "Isodge", position: "PGA", empId: "EIB5268" },
  { first: "Osheku", middle: "Godwin", last: "Idowu", position: "Maintenance", empId: "EIB8353" },
  { first: "Segun", middle: "Omokhgbor", last: "Joseph", position: "Maintenance", empId: "EIB2543" },
  { first: "Akunne", middle: "Austin", last: "Uzim", position: "PGA", empId: "EIB3152" }
];

const http = require('http');

http.get('http://localhost:3000/api/create-luft-paytv-staff?secret=eib-fix-2026&mode=execute', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('API Execution Result:', result.success ? 'Success' : 'Failed');
      
      const analysis = result.analysis;
      const alreadyExists = analysis.alreadyExists || [];
      const toCreate = analysis.toCreate || [];

      // Map emails back to staff
      const staffWithEmails = LUFT_PAYTV_STAFF.map(staff => {
        const fullName = [staff.first, staff.middle, staff.last].filter(Boolean).join(" ").trim().toLowerCase();
        const firstLast = `${staff.first} ${staff.last}`.trim().toLowerCase();
        const lastFirst = `${staff.last} ${staff.first}`.trim().toLowerCase();
        
        let email = "";
        
        const existing = alreadyExists.find(e => 
          e.name.toLowerCase() === fullName || 
          e.name.toLowerCase() === firstLast || 
          e.name.toLowerCase() === lastFirst
        );
        
        if (existing) {
          email = existing.officialEmail;
        } else {
          const cleanFirst = staff.first.toLowerCase().replace(/[^a-z]/g, '');
          const cleanLast = staff.last.toLowerCase().replace(/[^a-z]/g, '');
          email = `${cleanFirst}.${cleanLast}@luftpaytv.com`;
        }

        return { ...staff, email };
      });

      // Generate HTML
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Luft Pay TV - Staff Credentials Directory</title>
  <style>
    body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 40px; }
    h1 { color: #1a237e; font-size: 24px; margin-bottom: 5px; }
    h2 { color: #5c6bc0; font-size: 18px; margin-top: 0; margin-bottom: 30px; }
    h3 { color: #1a237e; font-size: 18px; margin-bottom: 10px; }
    .staff-count { color: #555; margin-bottom: 20px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 12px; }
    th, td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
    th { background-color: #1a237e; color: #fff; font-weight: bold; }
    
    .notice-box {
      border: 3px solid #d32f2f;
      padding: 20px;
      margin-bottom: 40px;
      text-align: center;
      color: #d32f2f;
    }
    .notice-box h4 {
      margin: 0 0 15px 0;
      font-size: 16px;
      text-transform: uppercase;
    }
    .notice-box p {
      margin: 0 0 15px 0;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.5;
    }
    .notice-box p:last-child {
      margin-bottom: 0;
    }

    @media print {
      body { padding: 0; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <div style="text-align: center;">
    <h1>EIB GROUP</h1>
    <h2>Staff Login Credentials Directory</h2>
  </div>

  <div class="notice-box">
    <h4>SECURITY NOTICE: REQUIRED PASSWORD UPDATE</h4>
    <p>Welcome! Your account was generated using a temporary default password during our system rollout.</p>
    <p>To ensure the complete privacy and security of your account, you are required to set a personal password before accessing the platform. This guarantees that only you have access to your account.</p>
    <p>AHEAD OF THE CURVE: We are continuously expanding our training catalog, actively populating the platform with world-class, industry-standard courses designed to elevate your professional capabilities and drive our Group forward.</p>
    <p>STRATEGIC ALIGNMENT: All Executive Retreat Briefings are securely available on the platform for direct consulting, reference, and strategic alignment (Accessible exclusively to Group Heads and Subsidiary Managers).</p>
  </div>
  
  <h3>LUFT PAY TV</h3>
  <div class="staff-count">Total Staff: ${staffWithEmails.length}</div>
  
  <table>
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Job Title / Role</th>
        <th>Login Email</th>
        <th>Temp Pwd</th>
      </tr>
    </thead>
    <tbody>
      ${staffWithEmails.map(s => `
        <tr>
          <td>${s.first}</td>
          <td>${s.last}</td>
          <td>${s.position}</td>
          <td>${s.email}</td>
          <td>Changepwd</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
      `;

      fs.writeFileSync('Luft_Pay_TV_Staff_Credentials.html', html);
      console.log('Generated Luft_Pay_TV_Staff_Credentials.html');
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
