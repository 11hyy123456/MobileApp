const app = getApp();

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token;
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };

    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: app.globalData.apiBaseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 200 || res.data.code === 201) {
            resolve(res.data);
          } else {
            if (res.data.code === 401) {
              app.clearLoginInfo();
              wx.redirectTo({ url: '/pages/login/login' });
            }
            reject(res.data);
          }
        } else {
          reject({ message: '网络请求失败', statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        reject({ message: '网络连接失败', error: err });
      }
    });
  });
};

const api = {
  auth: {
    register: (data) => request({ url: '/auth/register', method: 'POST', data }),
    login: (data) => request({ url: '/auth/login', method: 'POST', data }),
    getProfile: () => request({ url: '/auth/profile' }),
    updateProfile: (data) => request({ url: '/auth/profile', method: 'PUT', data })
  },

  notes: {
    list: (params) => request({ url: '/notes', method: 'GET', data: params }),
    detail: (id) => request({ url: `/notes/${id}` }),
    create: (data) => request({ url: '/notes', method: 'POST', data }),
    update: (id, data) => request({ url: `/notes/${id}`, method: 'PUT', data }),
    delete: (id, permanent) => request({ url: `/notes/${id}`, method: 'DELETE', data: { permanent } }),
    recover: (id) => request({ url: `/notes/${id}/recover`, method: 'POST' }),
    review: (id, data) => request({ url: `/notes/${id}/review`, method: 'POST', data }),
    dueReviews: () => request({ url: '/notes/due-reviews' })
  },

  categories: {
    list: () => request({ url: '/categories' }),
    create: (data) => request({ url: '/categories', method: 'POST', data }),
    update: (id, data) => request({ url: `/categories/${id}`, method: 'PUT', data }),
    delete: (id) => request({ url: `/categories/${id}`, method: 'DELETE' })
  },

  tags: {
    list: () => request({ url: '/tags' }),
    create: (data) => request({ url: '/tags', method: 'POST', data }),
    delete: (id) => request({ url: `/tags/${id}`, method: 'DELETE' }),
    notes: (id, params) => request({ url: `/tags/${id}/notes`, data: params })
  }
};

module.exports = api;
