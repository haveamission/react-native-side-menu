![npm](https://img.shields.io/npm/v/@chakrahq/react-native-side-menu)

## Customizable side menu for react-native

| iOS | Android |
| --- | --- |
| <img src="https://user-images.githubusercontent.com/6936373/71641602-eb969700-2ce1-11ea-9698-c251ccd19b65.png" width="320" />  | <img src="https://user-images.githubusercontent.com/6936373/71641601-eb969700-2ce1-11ea-82e3-c09a63145989.png" width="320" />  |


### Content
- [Installation](#installation)
- [Usage example](#usage-example)
- [Component props](#component-props)
- [Questions?](#questions)
- [Credits](#credits)

### Installation
```bash
npm install @haveamission/react-native-side-menu --save
```

### Usage example
```javascript
import SideMenu from 'react-native-side-menu'

class ContentView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
}

class Application extends React.Component {
  render() {
    const menu = <Menu navigator={navigator}/>;

    return (
      <SideMenu menu={menu}>
        <ContentView/>
      </SideMenu>
    );
  }
}
```

### Component props

| prop | default | type | description |
| ---- | ---- | ----| ---- |
| menu | inherited | React.Component | Menu component |
| isOpen |false | Boolean | Props driven control over menu open state |
| openMenuOffset | 2/3 of device screen width | Number | Content view left margin if menu is opened |
| hiddenMenuOffset | none | Number | Content view left margin if menu is hidden |
| edgeHitWidth | none | Number | Edge distance on content view to open side menu, defaults to 60 |
| toleranceX | none | Number | X axis tolerance |
| toleranceY | none | Number | Y axis tolerance |
| disableGestures | false | Bool | Disable whether the menu can be opened with gestures or not |
| onStartShould <br /> SetResponderCapture | none | Function | Function that accepts event as an argument and specify if side-menu should react on the touch or not. Check https://facebook.github.io/react-native/docs/gesture-responder-system.html for more details |
| onChange | none | Function | Callback on menu open/close. Is passed isOpen as an argument |
| onMove | none | Function | Callback on menu move. Is passed left as an argument |
| onSliding | none | Function | Callback when menu is sliding. It returns a decimal from 0 to 1 which represents the percentage of menu offset between hiddenMenuOffset and openMenuOffset.|
| menuPosition | left | String | either 'left' or 'right' |
| animationFunction | none | (Function -> Object) | Function that accept 2 arguments (prop, value) and return an object: <br /> - `prop` you should use at the place you specify parameter to animate <br /> - `value` you should use to specify the final value of prop |
| onAnimationComplete | none | (Function -> Void) | Function that accept 1 optional argument (event): <br /> - `event` you should this to capture the animation event after the animation has successfully completed |
| animationStyle | none | (Function -> Object) | Function that accept 1 argument (value) and return an object: <br /> - `value` you should use at the place you need current value of animated parameter (left offset of content view) |
| bounceBackOnOverdraw | true | boolean | when true, content view will bounce back to openMenuOffset when dragged further |
| autoClosing | true | boolean | When true, menu close automatically as soon as an event occurs |
| allowOverlayPressPropagation | false | boolean | When true, press events on the overlay can be propagated to the buttons inside your page |
| overlayColor | transparent | string | Page overlay color when sidebar open |
| overlayOpacity | 1 | Number | Page overlay opacity when sidebar open |
| animateOverlayOpacity | true | boolean | When true, the page overlay opacity is animated from 0 to overlayOpacity |

### FAQ

#### ScrollView does not scroll to top on status bar press

On iPhone, the scroll-to-top gesture has no effect if there is more than one scroll view on-screen that has scrollsToTop set to true. Since it defaults to `true` in ReactNative, you have to set `scrollsToTop={false}` on your ScrollView inside `Menu` component in order to get it working as desired.

#### The swipe animation is extremely slow

Try disabling remote JS debugging (from developer menu on phone/VD)

#### My SideMenu contents are visible even when the side menu is hidden

Ensure that your main view has a background color applied

```
<Sidemenu menu={menu}>
<App style={{backgroundColor='white'}} />
</SideMenu>
```
### Questions?
Feel free to [create an issue](https://github.com/chakrahq/react-native-side-menu/issues/new)

### Credits
This repository is a fork of a fork of a fork. Original sources were not maintained for long, so we created this fork and maintain it. We would like to give our thanks and credit for the efforts of the original authors and contributors of these original sources:
- [chakrahq/react-native-side-menu](https://github.com/chakrahq/react-native-side-menu)
- [Kureev/react-native-side-menu](https://github.com/Kureev/react-native-side-menu)
- [alessiocancian/react-native-side-menu](https://github.com/alessiocancian/react-native-side-menu)

