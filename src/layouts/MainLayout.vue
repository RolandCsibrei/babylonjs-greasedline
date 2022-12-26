<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-sticky position="top-left" :offset="[8, 8]" class="z-top">
      <q-btn icon="menu" @click="leftDrawerOpen = true" :flat="false" size="md" v-if="!leftDrawerOpen"></q-btn>
    </q-page-sticky>
    <q-drawer v-model="leftDrawerOpen" overlay :width="400">
      <q-tabs v-model="tab" inline-label>
        <q-tab name="basics" label="Basics" />
        <q-tab name="pbr" label="PBR" />
        <q-tab name="tools" label="Tools" />
        <q-tab name="demos" icon="star" label="Demos" />
      </q-tabs>
      <q-scroll-area style="height:100%" class="q-pb-xl">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="basics">
            <q-list class="q-mt-md">
              <EssentialLink v-for="link in basicLinks" :key="link.title" v-bind="link" />
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="pbr">
            <q-list class="q-mt-md">
              <EssentialLink v-for="link in pbrLinks" :key="link.title" v-bind="link" />
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="tools">
            <q-list class="q-mt-md">
              <EssentialLink v-for="link in toolsLinks" :key="link.title" v-bind="link" />
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="demos">
            <q-list class="q-mt-md">
              <EssentialLink v-for="link in demoLinks" :key="link.title" v-bind="link" />
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'src/components/NavLinks.vue';
import { basicLinks, pbrLinks, toolsLinks, demoLinks } from 'components/models'

const tab = ref('basics')
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.q-drawer__content {
  overflow: hidden;
}
</style>
