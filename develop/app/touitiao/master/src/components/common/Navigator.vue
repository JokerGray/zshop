<script>

/*
The navigator accept a 'isMain' prop, which receives a filter function that determines
if a page should not be 'stacked' while navigating.

A stacked page will be shown in sub stage, which will slide in from right when initialized,
and the page will be initialized every time.

An un-stacked page will be shown in main stage, which will have no animation when initialized,
and the page will be cached

basic rules:

- from main
  - to main
    - replace the page on main view
  - to sub
    - push a new page to stack
- form sub
  - to main
    - replace the page on main view, then pop every pages in stack and move to main
  - to sub
    - if the sub page to navigate is visited, pop every pages between current and the sub page and move to the sub page
    - else, push a new page to stack

 */

import _ from 'lodash'

export default {
  name: 'navigator',
  props: {
    onBeforeEnter: {
      type: Function
    },
    onBeforeLeave: {
      type: Function
    },
    onEnter: {
      type: Function
    },
    onLeave: {
      type: Function
    },
    isMain: {
      type: Function
    },
    onTouch: {
      type: Function
    },
    swipeBackEdgeThreshold: {
      type: Number
    },
    swipeBackReleaseThreshold: {
      type: Number
    }
  },
  created() {
    this.fromRoute = '';
    this.toRoute = '';
    this.cache = {};
    this.history = [];
    this.backInvokedByGesture = false
  },
  data() {
    return {
      clear: false
    }
  },
  methods: {
    // util functions
    // remove redundant part of a route path, and transform '/' to '-'
    // for main route, this leaves only first part of the path
    // for sub rmote, this leaves everything before the first dynamic part ('/:')
    getKeyForRoute(path) {
      let key = path.slice(1) ;// remove first ‘/’
      key = key.split('/');
      for (let i = 0; i < key.length; i++) {
        if (key[i][0] === ':') { // this is a dynamic part of the route path
          key.splice(i) // truncate from here
        }
      }
      return key.join('-')
    },
    // truncate sub paths and parameters, and replace slashes with hyphen, as is not a valid dom selector
    getNavigatorPageId(key) {
      return 'navigator-page-' + key.replace(/\/.*/, '').replace(/\//g, '-')
    },
    randomStr() {
      const possible = '0123456789abcdef';
      let str = '';
      for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * possible.length);
        str += possible[index]
      }
      return str
    },
    transitionEndCallback() {
      this.clear = true
    },

    // functions that returns vNode
    wrap(options) {
      const { route, node, key, outerAttrs } = options;
      const defaultNodeOption = {
        class: {
          'navigator-page': true
        },
        key,
        attrs: {
          id: this.getNavigatorPageId(route),
          route
        }
      };
      const nodeOption = _.merge(defaultNodeOption, outerAttrs);
      return this.$createElement('div', nodeOption, [node])
    },

    // handler functions
    mainToMain(toRoute) {
      // hide main stage that does not match current route
      // this fixes the issue when there is element on bottom main stage page whose z-index is too big
      for (var route in this.cache) {
        if (this.cache.hasOwnProperty(route)) {
          const cached = this.cache[route];
          if (this.isMain(cached.$route)) {
            if (cached.route === toRoute) {
              cached.outerAttrs.class = {
                'navigator-page-hidden': false
              }
            } else {
              cached.outerAttrs.class = {
                'navigator-page-hidden': true
              }
            }
          }
        }
      }
    },
    mainToSub(fromRoute, toRoute) {
      // the cached vnode for toRoute need to be hidden before mounting
      const cachedNode = this.cache[toRoute];
      cachedNode.outerAttrs.class = {
        'navigator-page-hidden': true
      };
      // after mounting, call transition hooks to execute transition
      setTimeout(() => {
        const leaveEl = document.querySelector('#' + this.getNavigatorPageId(fromRoute));
        const enterEl = document.querySelector('#' + this.getNavigatorPageId(toRoute));

        this.onBeforeLeave(leaveEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onLeave(leaveEl, this.transitionEndCallback)
        }, 50);

        // make enterEl visible at this time, and restore state in this.cache accordingly
        enterEl.className = enterEl.className.replace(/ ?navigator-page-hidden/, '');
        cachedNode.outerAttrs.class = {
          'navigator-page-hidden': false
        };
        this.onBeforeEnter(enterEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onEnter(enterEl, this.transitionEndCallback)
        }, 50);
      }, 0)
    },
    subToMain(fromRoute, toRoute) {
      // hide main stage that does not match current route
      // this fixes the issue when there is element on bottom main stage page whose z-index is too big
      this.mainToMain(toRoute);
      const cachedNode = this.cache[toRoute];
      cachedNode.outerAttrs.class = {
        'navigator-page-hidden': true
      };
      // call transition handler in reverse
      setTimeout(() => {
        const leaveEl = document.querySelector('#' + this.getNavigatorPageId(fromRoute));
        const enterEl = document.querySelector('#' + this.getNavigatorPageId(toRoute));
        this.onLeave(enterEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onBeforeLeave(enterEl, this.transitionEndCallback)
        }, 50);

        // make enterEl visible at this time, and restore state in this.cache accordingly
        enterEl.className = enterEl.className.replace(/ ?navigator-page-hidden/, '');
        cachedNode.outerAttrs.class = {
          'navigator-page-hidden': false
        };

        this.onEnter(leaveEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onBeforeEnter(leaveEl, this.transitionEndCallback)
        }, 50);
      }, 0);
    },
    subToSub(fromRoute, toRoute) {
      // the cached vnode for toRoute need to be hidden before mounting
      this.mainToMain(toRoute);
      const cachedNode = this.cache[toRoute];
      cachedNode.outerAttrs.class = {
        'navigator-page-hidden': true
      };
      // after mounting, call transition hooks to execute transition
      setTimeout(() => {
        const leaveEl = document.querySelector('#' + this.getNavigatorPageId(fromRoute));
        const enterEl = document.querySelector('#' + this.getNavigatorPageId(toRoute));

        this.onBeforeLeave(leaveEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onLeave(leaveEl, this.transitionEndCallback)
        }, 50);

        // make enterEl visible at this time, and restore state in this.cache accordingly
        enterEl.className = enterEl.className.replace(/ ?navigator-page-hidden/, '');
        cachedNode.outerAttrs.class = {
          'navigator-page-hidden': false
        };
        this.onBeforeEnter(enterEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onEnter(enterEl, this.transitionEndCallback)
        }, 50);
      }, 0)
    },
    // from sub page to a visited sub page
    subToVisited(fromRoute, toRoute) {
      // call transition handler in reverse
      setTimeout(() => {
        const leaveEl = document.querySelector('#' + this.getNavigatorPageId(fromRoute));
        const enterEl = document.querySelector('#' + this.getNavigatorPageId(toRoute));

        this.onLeave(enterEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onBeforeLeave(enterEl, this.transitionEndCallback)
        }, 50);

        this.onEnter(leaveEl, this.transitionEndCallback);
        setTimeout(() => {
          this.onBeforeEnter(leaveEl, this.transitionEndCallback)
        }, 50);
      }, 0);
    },

    // touch handler functions
    handleTouchStart(e) {
      // when navigated to a main stage, there is no need to handle touch event
      if (this.isMain(this.$route)) {
        return
      }
//       when the touch x is greater than threshold, this is no need to handle touch event
      const x = e.touches[0].pageX;
      if (x / window.document.documentElement.clientWidth > this.swipeBackEdgeThreshold) {
        return
      }
      this.touching = true
    },

    handleTouchMove(e) {
      if (this.touching) {
        const childrenEl = this.$el.children;
        const enterEl = Array.prototype.slice.call(childrenEl, -1)[0];
        const leaveEl = Array.prototype.slice.call(childrenEl, -2, -1)[0]
//        this.onTouch(enterEl, leaveEl, e.touches[0].pageX, e.touches[0].pageY)
      }
    },

    handleTouchEnd(e) {
      if (this.touching) {
        const childrenEl = this.$el.children;
        const el = Array.prototype.slice.call(childrenEl, -1)[0];
        const leaveEl = Array.prototype.slice.call(childrenEl, -2, -1)[0];
        const x = e.changedTouches[0].pageX;
        const y = e.changedTouches[0].pageY;
        if (x / window.document.documentElement.clientWidth > this.swipeBackReleaseThreshold) {
          // navigate back, manually set route to previous location
          this.onBeforeLeave(leaveEl, () => {
            this.backInvokedByGesture = true;
            this.transitionEndCallback();
            this.$router.go(-1)
          });
          this.onBeforeEnter(el, () => {})
        } else {
          // stay on the same stage
          this.onLeave(leaveEl, () => {});
          this.onEnter(el, () => {})
        }
      }
      this.touching = false
    }
  },
  render(h) {
    // in case where $route is not defined
    if (!this.$route) {
      this.clear = false;
      return this._vnode
    }
    // var str = this.$route.path.split('/');
    // str.splice(0,1);
    // str.splice(str.length-1,1);
    // str = '/'+str.join('/')+'/:type';
    // this.toRoute = this.getKeyForRoute(this.$route.matched.length!==0?this.$route.matched[0].path:str);
    this.toRoute = this.getKeyForRoute(this.$route.matched[0].path);
    // if the route change is invoked by gesture, manually clear last entry of this.history and this.cache
    // and return composed routers
    if (this.backInvokedByGesture) {
      this.backInvokedByGesture = false;
      const toDelete = this.history.pop();
      delete this.cache[toDelete];

      const children = [];
      for (let i = 0; i < this.history.length; i++) {
        const cached = this.cache[this.history[i]];
        const node = this.wrap(cached);
        children.push(node)
      }

      // return composed vNodes to render
      const composedVNode = h('div', {
        class: 'navigator',
        on: {
          //屏蔽右滑返回功能
          // touchmove: this.handleTouchMove,
          // touchstart: this.handleTouchStart,
          // touchend: this.handleTouchEnd
        }
      }, children);
      return composedVNode
    }
    // when render function is called by transitionEndCallback (this.clear === true)
    // because this.cache is updated at this time
    // we only need to return a composed vnode based on cache
    if (this.clear) {
      this.clear = false;
      // clear history item, if now on main stage, exclude every sub stage history entry
      // clear this.cache accordingly
      if (this.isMain(this.cache[this.toRoute].$route)) {
        this.history = this.history.filter((route) => {
          return this.isMain(this.cache[route].$route)
        });
        for (let route in this.cache) {
          if (this.cache.hasOwnProperty(route)) {
            if (!this.isMain(this.cache[route].$route)) {
              delete this.cache[route]
            }
          }
        }
      // else, truncate every sub stage history entry after current sub stage
      // clear this.cache accordingly
      } else {
        const toClear = this.history.splice(this.history.indexOf(this.toRoute) + 1);
        for (let i = 0; i < toClear.length; i++) {
          delete this.cache[toClear[i]]
        }
      }

      // reset every main stage except the one beneath sub stage to normal position by calling transition callback
      setTimeout(() => {
        const doms = document.querySelectorAll('.navigator-page');
        for (var i = 0; i < doms.length; i++) {
          const route = doms[i].getAttribute('route');
          // 自己加的，避免报错
          if(!this.cache[route]){
            return
          }
          if (this.isMain(this.cache[route].$route)) {
            this.onBeforeLeave(doms[i], () => {})
          }
        }
      }, 200);
      // if navigated to the first and only sub stage, make the main stage beneath visible
      if (!this.isMain(this.$route) && this.history.filter((route) => {
        return !this.isMain(this.cache[route].$route)
      }).length === 1) {
        const mainRoutes = this.history.filter((route) => {
          return this.isMain(this.cache[route].$route)
        });
        const lastMainRoute = mainRoutes[mainRoutes.length - 1];
        // 自己加的if判断，避免刷新页面后报错报错
        if(this.cache[lastMainRoute]){
          this.cache[lastMainRoute].outerAttrs.class = {
            'navigator-page-hidden': false
          }
        }
      }

      // compose the final vnode tree
      const children = [];
      for (let i = 0; i < this.history.length; i++) {
        const cached = this.cache[this.history[i]];
        const node = this.wrap(cached);
        children.push(node)
      }

      // update route record
      this.fromRoute = this.toRoute;
      // return composed vNodes to render
      const composedVNode = h('div', {
        class: 'navigator',
        on: {
          //屏蔽右滑返回功能
          // touchmove: this.handleTouchMove,
          // touchstart: this.handleTouchStart,
          // touchend: this.handleTouchEnd
        }
      }, children);
      return composedVNode
    }

    // when the render is triggered by custom vuex store mutation
    // (when 'this.toRoute' will remain unchanged), ignore it
    if (this.toRoute === this.fromRoute) {
      this.clear = false;
      return this._vnode
    }

    // if the vNode is not cached, render the new vNode and cache it
    if (!this.cache[this.toRoute]) {
      const component = this.$route.matched[0].components.default;
      const routeVNode = h(component);
      // wrap cached vNode with a div
      this.cache[this.toRoute] = {
        route: this.toRoute,
        $route: this.$route, // the route rule object
        node: routeVNode,
        key: this.randomStr(),
        outerAttrs: {}
      }
    }

    // handle different navigation cases.
    // this.history act as a page order indicator
    // as main stage is cached, there could be multiple main stage entries in this.history

    // if no from route (initial render)
    if (!this.fromRoute) {
      this.history = [this.toRoute]
    } else {
      // from main stage
      if (this.isMain(this.cache[this.fromRoute].$route)) {
        // to main stage
        if (this.isMain(this.cache[this.toRoute].$route)) {
          if (this.history.indexOf(this.toRoute) > -1) {
            this.history.splice(this.history.indexOf(this.toRoute), 1)
          }
          this.history.push(this.toRoute);
          this.mainToMain(this.toRoute)
        // to sub stage
        } else {
          this.history.push(this.toRoute);
          this.mainToSub(this.fromRoute, this.toRoute)
        }
      // from sub stage
      } else {
        // to main stage
        if (this.isMain(this.cache[this.toRoute].$route)) {
          // exclude route item that is not a main stage
          this.history = this.history.filter((route) => {
            return this.isMain(this.cache[route].$route)
          });
          // then reorder
          if (this.history.indexOf(this.toRoute) > -1) {
            this.history.splice(this.history.indexOf(this.toRoute), 1)
          }
          this.history.push(this.toRoute);
          this.history.push(this.fromRoute); // this should also be kept in history temporarily, for transition
          this.subToMain(this.fromRoute, this.toRoute)
        // to sub stage
        } else {
          // if the sub to navigate is already visited
          if (this.history.indexOf(this.toRoute) > -1) {
            this.history.splice(this.history.indexOf(this.toRoute) + 1) ;// truncate history to current page
            this.history.push(this.fromRoute) ;// this should also be kept in history temporarily, for transition
            this.subToVisited(this.fromRoute, this.toRoute)
          } else {
            this.history.push(this.toRoute);
            this.subToSub(this.fromRoute, this.toRoute)
          }
        }
      }
    }
    // update route record
    this.fromRoute = this.toRoute;
    this.clear = false;
    // compose the final vnode tree
    const children = [];
    for (let i = 0; i < this.history.length; i++) {
      const cached = this.cache[this.history[i]];
      const node = this.wrap(cached);
      children.push(node)
    }

    // return composed vNodes to render
    const composedVNode = h('div', {
      class: 'navigator',
      on: {
        //屏蔽右滑返回功能
        // touchmove: this.handleTouchMove,
        // touchstart: this.handleTouchStart,
        // touchend: this.handleTouchEnd
      }
    }, children)
    return composedVNode
  }

}
</script>

<style>
  .navigator-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
  }
  .navigator {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    /*overflow: hidden;*/
  }
  .navigator-page-hidden{
    display: none;
  }
</style>
