import fs from 'node:fs'
import { MongoClient } from 'mongodb'

const iconMeta = {
  ai: ['AI skill icon', '/skill-icons/ai.svg'],
  backend: ['Backend skill icon', '/skill-icons/backend.svg'],
  database: ['Database skill icon', '/skill-icons/database.svg'],
  devops: ['DevOps skill icon', '/skill-icons/devops.svg'],
  framework: ['AI framework skill icon', '/skill-icons/framework.svg'],
  language: ['Programming language skill icon', '/skill-icons/language.svg'],
  mobile: ['Mobile development skill icon', '/skill-icons/mobile.svg'],
  tool: ['Development tool skill icon', '/skill-icons/tool.svg']
}

const priority = [
  'Artificial Intelligence',
  'Generative AI',
  'Agentic AI',
  'LLM Integration',
  'Retrieval-Augmented Generation (RAG)',
  'Prompt Engineering',
  'Vector Databases',
  'LangChain',
  'LangGraph',
  'Computer Vision',
  'Python',
  'FastAPI',
  'REST API Development',
  'SQL',
  'MongoDB',
  'Firebase',
  'Docker',
  'Git',
  'Flutter',
  'Dart',
  'C++',
  'C#'
]

const iconByName = new Map([
  ['Artificial Intelligence', 'ai'],
  ['Generative AI', 'ai'],
  ['Agentic AI', 'ai'],
  ['LLM Integration', 'ai'],
  ['Retrieval-Augmented Generation (RAG)', 'ai'],
  ['Prompt Engineering', 'ai'],
  ['Computer Vision', 'ai'],
  ['LangChain', 'framework'],
  ['LangGraph', 'framework'],
  ['Vector Databases', 'database'],
  ['SQL', 'database'],
  ['MongoDB', 'database'],
  ['Firebase', 'database'],
  ['FastAPI', 'backend'],
  ['REST API Development', 'backend'],
  ['Docker', 'devops'],
  ['Git', 'tool'],
  ['Flutter', 'mobile'],
  ['Dart', 'mobile'],
  ['Python', 'language'],
  ['C++', 'language'],
  ['C#', 'language']
])

function readEnv() {
  const file = '.env.local'
  if (!fs.existsSync(file)) {
    throw new Error('.env.local was not found.')
  }

  const env = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    let value = trimmed.slice(index + 1).trim()
    value = value.replace(/^['"]|['"]$/g, '')
    env[trimmed.slice(0, index).trim()] = value
  }
  return env
}

const env = readEnv()
if (!env.DATABASE_URI) {
  throw new Error('DATABASE_URI is missing from .env.local.')
}

const dryRun = process.argv.includes('--dry-run')
const verify = process.argv.includes('--verify')
const client = new MongoClient(env.DATABASE_URI, { serverSelectionTimeoutMS: 15000 })

try {
  await client.connect()
  const db = client.db()
  const now = new Date().toISOString()
  const mediaCollection = db.collection('media')
  const skillsCollection = db.collection('skills')

  if (verify) {
    const docs = await skillsCollection.find({}).project({ name: 1, order: 1, icon: 1 }).sort({ order: 1 }).toArray()
    const summary = []

    for (const doc of docs) {
      const icon = doc.icon ? await mediaCollection.findOne({ _id: doc.icon }) : null
      summary.push({
        name: doc.name,
        order: doc.order,
        icon: icon?.filename || null,
        url: icon?.url || null
      })
    }

    console.table(summary)
    const missingIcons = summary.filter((item) => !item.icon)
    console.log(missingIcons.length ? `${missingIcons.length} skill icons are still missing.` : 'All skills have icons.')
    process.exit(0)
  }

  const iconIds = new Map()

  for (const [key, [alt, url]] of Object.entries(iconMeta)) {
    const filename = `skill-${key}.svg`
    let media = await mediaCollection.findOne({ filename })

    if (!media && !dryRun) {
      const result = await mediaCollection.insertOne({
        alt,
        caption: 'Neon portfolio skill icon',
        filename,
        filesize: fs.statSync(`public${url}`).size,
        height: 96,
        mimeType: 'image/svg+xml',
        updatedAt: now,
        url,
        width: 96,
        createdAt: now
      })
      media = { _id: result.insertedId, filename, url }
    }

    if (media && !dryRun) {
      await mediaCollection.updateOne(
        { _id: media._id },
        {
          $set: {
            alt,
            caption: 'Neon portfolio skill icon',
            filesize: fs.statSync(`public${url}`).size,
            height: 96,
            mimeType: 'image/svg+xml',
            updatedAt: now,
            url,
            width: 96
          }
        }
      )
      iconIds.set(key, media._id)
    }
  }

  const skills = await skillsCollection.find({}).toArray()
  const priorityIndex = new Map(priority.map((name, index) => [name.toLowerCase(), index]))
  const ordered = skills
    .map((skill) => ({
      ...skill,
      nextIndex: priorityIndex.has(String(skill.name).toLowerCase())
        ? priorityIndex.get(String(skill.name).toLowerCase())
        : priority.length + 100 + String(skill.name).localeCompare('')
    }))
    .sort((a, b) => a.nextIndex - b.nextIndex || String(a.name).localeCompare(String(b.name)))

  const summary = []

  for (const [index, skill] of ordered.entries()) {
    const iconKey = iconByName.get(skill.name) || 'tool'
    const order = (index + 1) * 10

    summary.push({
      name: skill.name,
      icon: iconKey,
      order
    })

    if (!dryRun) {
      await skillsCollection.updateOne(
        { _id: skill._id },
        {
          $set: {
            icon: iconIds.get(iconKey),
            order,
            updatedAt: now
          }
        }
      )
    }
  }

  console.table(summary)
  console.log(dryRun ? 'Dry run only. No CMS data changed.' : 'Skills icon media and order updated.')
} finally {
  await client.close()
}
