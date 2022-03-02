<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户登录</template>
    </nav-bar>

    <div style="margin-top: 50px">
      <div style="text-align: center; padding-top: 30px">
        <van-image
          width="10rem"
          height="6.5rem"
          fit="contain"
          src="https://s1.hdslb.com/bfs/static/jinkela/space/assets/icon-auth.png"
        />
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="email"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <div class="link-login" @click="$router.push({ path: '/register' })">
            没有账号，立即注册
          </div>
          <van-button
            color="#44b883"
            round
            block
            type="primary"
            native-type="submit"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, reactive, toRefs } from "vue";
import { login } from "network/user";
import { useRouter } from "vue-router";
import { Notify, Toast } from "vant";
import {useStore} from 'vuex';
export default {
  name: "Login",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();

    const store = useStore();

    const userinfo = reactive({
      email: "",
      password: "",
    });

    const onSubmit = () => {
      login(userinfo).then((res) => {
        window.localStorage.setItem("token", res.access_token);
        Toast.success("登陆成功");
        userinfo.email = "";
        userinfo.password = "";

        store.commit('setIsLogin',true);

        setTimeout(() => {
          router.go(-1);
        }, 500);
      });
    };

    return {
      ...toRefs(userinfo),
      onSubmit,
    };
  },
};
</script>

<style scoped>
.link-login {
  font-size: 14px;
  margin-bottom: 20px;
  color: #42b983;
  display: inline-block;
  text-align: left;
}
</style>