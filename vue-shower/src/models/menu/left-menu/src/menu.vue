<template functional>
  <a-menu-item class="what-heppend"
               v-if="!props.menuData.children"
               @click="parent.menuClick(props.menuData.url)"
               :key="'M'+props.menuData.id">
    <a-icon :type="parent.getIco(props.menuData.name)" />
    <span class="title-style">{{props.menuData.name}}</span>
  </a-menu-item>
  <a-sub-menu ref="subMenu"
              v-else
              :key="'M'+props.menuData.id">
    <span slot="title">
      <a-icon :type="parent.getIco(props.menuData.name)" />
      <span class="title-style" slot="title">{{props.menuData.name}}</span>
    </span>
    <template v-for="menuObj in props.menuData.children">
      <a-menu-item
        v-if="!menuObj.children"
        :key="menuObj.key"
        @click="parent.menuClick(menuObj.url)"
      >
        <a-icon :type="parent.getIco(menuObj.name)" />
        <span class="title-style">{{menuObj.name}}</span>
      </a-menu-item>
      <WorkTopMenu
        v-else
        :key="'C'+menuObj.key"
        :menu-info="menuObj"
        class="sub-menu"
      />
    </template>
  </a-sub-menu >
</template>

<script>
export default {
name: 'WorkTopMenu',
props:{
  menuData:{
    type: Object
  }
}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
