import { createClient } from '@supabase/supabase-js'
import { seedModels } from '../src/lib/seeds'

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log(`Seeding ${seedModels.length} models...`)

  for (const model of seedModels) {
    const { data, error } = await supabase.from('models').insert(model).select().single()
    if (error) {
      console.error(`  ✗ ${model.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${model.name} (id: ${data.id})`)
    }
  }

  console.log('Done!')
}

seed()
