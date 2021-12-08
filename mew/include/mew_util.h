#include <node.h>
#include <node_internals.h>
#include <node_buffer.h>
#include <env.h>
#include <env-inl.h>

#include <functional>

#include <sqlite3.h>
#include <uv.h>

namespace node {

using v8::Function;
using v8::Local;
using v8::Value;

namespace mew_util {

extern void SleepForAWhile();

extern char *DuplicateString(char *string);

extern void DeleteString(char *string);

extern void CallbackError(Environment *env, Local<Function> &js_callback, int code, char *message);

extern void ScheduleJob(std::function<void(void)> job, std::function<void(void)> callback);

extern Local<Value> NewJSError(Environment *env, int code, char *message);

class MewUtilAsync {

  public:

    uv_async_t async;
    std::function<void(void)> callback;

    MewUtilAsync(uv_loop_t *event_loop);
    ~MewUtilAsync();

    void Send(std::function<void(void)> callback);

};

class MewUtilSync {
  public:

    uv_async_t async;
    std::function<void(void)> callback;

    MewUtilSync(uv_loop_t *event_loop);
    ~MewUtilSync();

    void Wait(std::function<void(void)> callback);

};

class MewUtilJSCallback {

  public:

    uv_async_t async;

    Environment *env;
    Persistent<Function> js_callback;

    std::function<void(Environment *, Local<Function>&)> callback;

    MewUtilJSCallback(Environment *env, Local<Value> js_callback);
    ~MewUtilJSCallback();

    void Send(std::function<void(Environment *, Local<Function>&)> callback);

    void CallbackError(int code, char *message);

};

class MewUtilHandleAction {

  public:
    std::function<void(void)> action;
    MewUtilHandleAction *next;

  MewUtilHandleAction(std::function<void(void)> action);

  MewUtilHandleAction(std::function<void(void)> action, MewUtilHandleAction *next);

  ~MewUtilHandleAction();

};

class MewUtilHandle {

  public:

    uv_loop_t *action_loop;

    uv_async_t action_async;
    uv_mutex_t action_mutex;

    MewUtilHandleAction *actions;

    MewUtilHandle(uv_loop_t *action_loop);

    ~MewUtilHandle();

    void Finalize();

    void Send(std::function<void(void)> action);

    void *SendSync(std::function<void *(void)> action);

};

}  // namespace mew_util
}  // namespace node
