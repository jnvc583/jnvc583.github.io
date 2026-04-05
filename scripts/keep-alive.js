import { createClient } from "@supabase/supabase-js";

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("缺少必要的环境变量");
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
  console.log(`[${new Date().toISOString()}] 开始执行保活任务`);
  
  let successCount = 0;
  const operations = [];
  
  // 方法1: 使用 Supabase Storage API 健康检查
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Storage API 检查错误:", error);
      operations.push({ method: "Storage API check", success: false, error: error.message });
    } else {
      console.log(`[${new Date().toISOString()}] Storage API 检查成功，Buckets 数量: ${data?.length || 0}`);
      operations.push({ method: "Storage API check", success: true });
      successCount++;
    }
  } catch (error) {
    console.error("Storage API 异常:", error);
    operations.push({ method: "Storage API check", success: false, error: String(error) });
  }
  
  // 方法2: 创建一个临时的查询来保活
  try {
    // 尝试查询一个不存在的表，这足以保持连接活跃
    const { data, error } = await supabase
      .from(`_keep_alive_test_${Date.now()}`)
      .select('*')
      .limit(1);
    
    // 预期会报错（表不存在），但这足以保持连接活跃
    if (error && error.code === '42P01') {
      console.log(`[${new Date().toISOString()}] 保活查询执行成功（预期的表不存在错误）`);
      operations.push({ method: "Keep-alive query", success: true });
      successCount++;
    } else if (error) {
      console.error("保活查询错误:", error);
      operations.push({ method: "Keep-alive query", success: false, error: error.message });
    } else {
      console.log(`[${new Date().toISOString()}] 保活查询意外成功`);
      operations.push({ method: "Keep-alive query", success: true });
      successCount++;
    }
  } catch (error) {
    console.error("保活查询异常:", error);
    operations.push({ method: "Keep-alive query", success: false, error: String(error) });
  }
  
  // 方法3: Auth API 健康检查
  try {
    const { error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Auth session missing!') {
      console.error("Auth API 检查错误:", error);
      operations.push({ method: "Auth API check", success: false, error: error.message });
    } else {
      console.log(`[${new Date().toISOString()}] Auth API 检查成功`);
      operations.push({ method: "Auth API check", success: true });
      successCount++;
    }
  } catch (error) {
    console.error("Auth API 异常:", error);
    operations.push({ method: "Auth API check", success: false, error: String(error) });
  }
  
  // 总结
  console.log(`[${new Date().toISOString()}] 保活任务执行完成`);
  console.log(`成功操作数: ${successCount}/${operations.length}`);
  console.log("操作详情:", JSON.stringify(operations, null, 2));
  
  // 只要有一个操作成功就认为保活成功
  if (successCount === 0) {
    console.error("所有保活操作都失败了");
    process.exit(1);
  }
}

// 执行保活任务
keepAlive()
  .then(() => {
    console.log("保活脚本执行成功");
    process.exit(0);
  })
  .catch((error) => {
    console.error("保活脚本执行失败:", error);
    process.exit(1);
  });