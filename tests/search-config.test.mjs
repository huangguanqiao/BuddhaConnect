import test from 'node:test';import assert from 'node:assert/strict';
import {filterSearchEntries,normalizeSearchParams} from '../src/lib/search-config.mjs';
const items=[{language:'zh-CN',published:true,title:'四圣谛',category:'入门',description:'苦集灭道',date:'2026-01-02'},{language:'en',published:true,title:'Four Noble Truths',category:'Basics',description:'Buddhist teachings',date:'2026-01-03'},{language:'zh-CN',published:false,title:'未审核',category:'入门',date:'2026-01-04'}];
test('search does not leak other locales or unpublished entries',()=>assert.deepEqual(filterSearchEntries(items,{language:'zh-CN'}).map(x=>x.title),['四圣谛']));
test('search query and category are configurable',()=>assert.deepEqual(filterSearchEntries(items,{language:'zh-CN',query:'苦集',category:'入门'}).map(x=>x.title),['四圣谛']));
test('unrecognized sort defaults to newest',()=>assert.equal(normalizeSearchParams({sort:'unsafe'}).sort,'newest'));
test('unknown language fails closed',()=>assert.throws(()=>filterSearchEntries(items,{language:'xx'})));
