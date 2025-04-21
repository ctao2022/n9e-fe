/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import request from '@/utils/request';
import { RequestMethod } from '@/store/common';

//获取节点状态
export const getstatus = function () {
  return request(`/slurm_api/status`, {
    method: RequestMethod.Get,
  }).then((res) => res.data||res);
};
//获取cpu状态
export const getcpustatus = function () {
  return request(`/slurm_api/cpustatus`, {
    method: RequestMethod.Get,
  });
};

//获取作业状态
export const getjobstatus = function () {
  return request(`/slurm_api/jobstatus`, {
    method: RequestMethod.Get,
  });
};


// 获取历史作业信息（30天）
export const getinfo = function () {
  return request(`/slurm_api/info`, {
    method: RequestMethod.Get,
    // data: {
    //   refresh_token: localStorage.getItem('refresh_token'),
    // },
  });
};