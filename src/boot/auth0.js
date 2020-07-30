import Vue from 'vue';
import { domain, clientId, audience } from '../../auth_config.json';
import { Auth0Plugin } from '../auth';
import router from '../router';

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});
