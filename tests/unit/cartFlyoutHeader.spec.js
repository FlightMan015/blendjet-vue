import { mount } from '@vue/test-utils'
import CartFlyoutHeader from '@/components/nacelle/CartFlyoutHeader'

xdescribe('CartFlyoutHeader.vue', () => {
  it('displays the cart header', async () => {
    const wrapper = mount(CartFlyoutHeader, {
      propsData: { title: 'Your Cart' }
    })
    expect(wrapper.find('flyout-cart-hearder-title').exists()).toBe(true)
  })
})
