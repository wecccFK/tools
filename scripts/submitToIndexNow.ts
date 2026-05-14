/**
 * IndexNow Submission Script
 * Run this script to submit all website URLs to IndexNow for search engine indexing
 * 
 * Usage: npx tsx scripts/submitToIndexNow.ts
 */

import { submitAllToolPages, submitHomepage } from '../src/services/indexNowService';

async function main() {
  console.log('🚀 Starting IndexNow submission...\n');

  // Submit homepage
  console.log('📄 Submitting homepage...');
  const homepageResult = await submitHomepage();
  if (homepageResult.success) {
    console.log('✅ Homepage submitted successfully\n');
  } else {
    console.error('❌ Homepage submission failed:', homepageResult.error, '\n');
  }

  // Submit all tool pages
  console.log('🔧 Submitting all tool pages...');
  const toolsResult = await submitAllToolPages();
  if (toolsResult.success) {
    console.log('✅', toolsResult.message, '\n');
  } else {
    console.error('❌ Tool pages submission failed:', toolsResult.error, '\n');
  }

  console.log('🎉 IndexNow submission completed!');
}

main().catch(console.error);
