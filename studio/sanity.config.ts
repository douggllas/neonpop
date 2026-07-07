import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { artigo } from './schemas/artigo'
import { autor } from './schemas/autor'
import { categoria } from './schemas/categoria'

export default defineConfig({
  name: 'neonpop',
  title: 'NEONPOP — Painel Editorial',
  projectId: 'zxroagtn',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: [artigo, autor, categoria] },
})
