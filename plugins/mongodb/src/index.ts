/**
 * Copyright 2024 The Fire Company
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { genkitPlugin, Plugin } from '@genkit-ai/core';
import { MongoClient } from 'mongodb';
import {} from './mongodb_tools';

export interface PluginOptions {
  connectionString?: string | 'mongodb+srv:///';
  dbName?: string | 'test';
  collectionName?: string | 'test';
  numCandidates?: number | 1;
}

export const mongodb: Plugin<[PluginOptions] | []> = genkitPlugin(
  'mongodb',
  async (options?: PluginOptions) => {
    const client = new MongoClient(options?.connectionString || '');
    const collection = client
      .db(options?.dbName)
      .collection(options?.collectionName || 'test');
    const query_object = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: '',
          numCandidates: options?.numCandidates || 1,
          limit: 1,
        },
      },
      {
        $project: { _id: 0, text: 1 },
      },
    ];
    const results = await collection.aggregate(query_object).toArray();
  
    return results;
  }
);

export default mongodb;
