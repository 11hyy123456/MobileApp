const Response = {
  success: (res, data = null, message = '操作成功') => {
    return res.json({
      code: 200,
      message,
      data
    });
  },

  created: (res, data = null, message = '创建成功') => {
    return res.status(201).json({
      code: 201,
      message,
      data
    });
  },

  error: (res, message = '操作失败', status = 500) => {
    return res.status(status).json({
      code: status,
      message
    });
  },

  unauthorized: (res, message = '未授权') => {
    return res.status(401).json({
      code: 401,
      message
    });
  },

  notFound: (res, message = '资源不存在') => {
    return res.status(404).json({
      code: 404,
      message
    });
  },

  validationError: (res, errors) => {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors
    });
  }
};

module.exports = Response;
