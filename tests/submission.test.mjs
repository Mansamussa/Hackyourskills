import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPayload,sendAudit} from '../src/submission.js';
test('preserves enquiry fields and links future context without redirect or language ambiguity',()=>{
 const p=auditPayload({name:'Test',email:'audit@example.com',website:'https://example.com',selling:'Services',goals:'Bookings',redirectTo:'old'}, {reference:'reference-1',language:'nl',packageInterest:'Fix Sprint'});
 assert.equal(p.email,'audit@example.com');assert.equal(p.enquiry_reference,'reference-1');assert.equal(p.language,'nl');assert.equal(p.package_interest,'Fix Sprint');assert.equal(p.redirectTo,undefined);assert.equal(p.goals,'Bookings');
});
test('only confirms an explicit successful provider response',async()=>{
 const p={enquiry_reference:'r'};let sent;
 await sendAudit('https://example.invalid',p,{transport:async(url,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({success:true})};}});
 assert.deepEqual(sent,p);
 for(const reply of [{ok:true,json:async()=>({success:false})},{ok:false,json:async()=>({success:true})},{ok:true,json:async()=>({})},{ok:true,json:async()=>{throw Error('invalid JSON')}}]) await assert.rejects(sendAudit('https://example.invalid',p,{transport:async()=>reply}));
});
test('times out a stalled request rather than confirming receipt',async()=>{
 await assert.rejects(sendAudit('https://example.invalid',{}, {timeout:10,transport:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted'))))}));
});
