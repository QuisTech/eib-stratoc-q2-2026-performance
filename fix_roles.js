require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const groupHeads = [
  'muhammad.bashir@eibgroup.com',
  'kenneth.onuh@eibgroup.com',
  'solomon.jideobi@eibgroup.com',
  'emanuella.ezenwochi@eibgroup.com',
  'paul.wokili@eibgroup.com',
  'anthony.itegbe@eibgroup.com',
  'bwala.dalta@eibgroup.com',
  'tesini.dombo@eibgroup.com',
  'ibrahim.ladan@eibgroup.com',
  'celina.john@eibgroup.com',
  'ayodeji.giwa@eibgroup.com',
  'nancy.manuezeuko@eibgroup.com',
  'donald.oshoke@eibgroup.com',
  'judith.sylvanus@eibgroup.com',
  'ishaku.tarfa@eibgroup.com'
];

const leads = [
  'helen.chikwem@eibstratoc.com',
  'helen.chikwem@dico.eibstratoc.com',
  'benjamin.antah@eibstratoc.com',
  'kenneth.mbadugha@briechatlantic.com',
  'junaid.raza@luftreiber.com',
  'anita.erukunuakpor@brightfm.com',
  'daniel.ejike@brightfm.com',
  'alinwaeze.jude@bef.com',
  'joy.abraham@briechhospital.com',
  'kate.edward@poctova.com',
  'marvis.okharedia@poctova.com',
  'iheanyichukwu.okpo@gigaforensics.com',
  'deborah.eyefia@gigaforensics.com',
  'mubarak.sani@briechuas.com',
  'ezekiel.okenyeka@dico.eibstratoc.com' // Specifically requested by user
];

async function updateRoles() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    for (const email of groupHeads) {
      const res = await pool.query(`UPDATE "user" SET role = 'group_head' WHERE email = $1`, [email]);
      if (res.rowCount > 0) console.log(`Upgraded ${email} to group_head`);
    }

    for (const email of leads) {
      const res = await pool.query(`UPDATE "user" SET role = 'lead' WHERE email = $1`, [email]);
      if (res.rowCount > 0) console.log(`Upgraded ${email} to lead`);
    }

    console.log('Done upgrading roles!');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

updateRoles();
