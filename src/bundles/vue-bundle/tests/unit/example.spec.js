import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Welcome to the Vuetify 3 Beta  For help and collaboration with other Vuetify developers, please join our online Discord Community What\'s next? Explore componentsRoadmapFrequently Asked Questions Important Links ChatMade with VuetifyTwitterArticles Ecosystem vuetify-loadergithubawesome-vuetify'
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
    console.log(wrapper.text())
    expect(wrapper.text()).toMatch(msg)
  })
})
