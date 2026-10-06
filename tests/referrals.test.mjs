import test from 'node:test';
import assert from 'node:assert/strict';
import {referralSource} from '../src/referrals.js';
test('classifies recognised sources without leaking paths or queries',()=>{
 assert.equal(referralSource('https://chatgpt.com/c/private-conversation?email=secret','https://hackyourskills.com'),'chatgpt');
 assert.equal(referralSource('https://gemini.google.com/app/secret','https://hackyourskills.com'),'gemini');
 assert.equal(referralSource('https://www.google.com/search?q=private','https://hackyourskills.com'),'google_search');
 assert.equal(referralSource('https://chatgpt.com.evil.test/','https://hackyourskills.com'),'other_referral');
 assert.equal(referralSource('https://hackyourskills.com/website-design','https://hackyourskills.com'),'internal');
 assert.equal(referralSource('','https://hackyourskills.com'),'direct_or_unknown');
});
