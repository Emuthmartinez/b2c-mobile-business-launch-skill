# Premium Mobile Craft: The Invisible Details

Use this before any in-app UI build, design handoff, or polish pass on a launched mobile app. It is the craft layer that sits under `design-visual-system.md` (token truth), `refero-ux-patterns.md` (flow shape), and `emotional-design-system.md` (emotional arc). Those decide *what* the screens are; this decides whether they *feel right*.

Premium does not mean flashy. The apps people love do not have wild animations, heavy blur that tanks performance, or motion that shouts for attention. They feel right — and that is the harder bar. Anyone can copy a bouncy animation from Dribbble; almost nobody nails the fifty invisible decisions that make an app feel built by people who care. None of the details below are flashy. That is the point. Premium is the compounding effect of stacking twenty of them. Users will not say which one mattered; they will just say "this app feels different."

This skill ships these details as boilerplate so a launched app starts with them baked in:

- SwiftUI: [`templates/design-system/PremiumCraft.swift`](../templates/design-system/PremiumCraft.swift) — press-state button style, semantic haptics, keyboard behavior, shimmer/skeleton, and an empty-state view, all reading `DesignTokens.Motion` and honoring Reduce Motion.
- The pattern contract: a **Premium Craft Details** section and bug traps in [`templates/ux-patterns/UX_PATTERNS.md`](../templates/ux-patterns/UX_PATTERNS.md).

## Platform Routing

The five details are platform-agnostic doctrine; the implementation differs by binary. The skill's mobile binary is SwiftUI, Flutter, or React Native — never framer-motion (web only; `check:template-safety` enforces this).

- **SwiftUI (latest Swift) is the primary target.** Use `PremiumCraft.swift`. On iOS 26, the system **Liquid Glass** affordances (`.glassEffect()`, `.buttonStyle(.glass)` / `.glassProminent`, `GlassEffectContainer`) give premium press feedback and material for free on system-shaped controls (toolbars, tab bars, floating actions, sheets, menus). Use glass for those chrome surfaces, never on content, and never stack glass on glass. Custom/branded controls and pre-iOS-26 users still need the explicit press/haptic/keyboard work below.
- **React Native** parity (the origin of this doctrine): `pressto` for press animations (built on `react-native-reanimated` + `react-native-gesture-handler`), `react-native-ease` for platform-API animations (Core Animation / Android Animator, zero JS overhead), `react-native-pulsar` for haptic presets and custom patterns, and `react-native-keyboard-controller` for keyboard layout. Drive all of it from the same `--motion-*` tokens; honor `useReducedMotion()`.
- **Flutter** parity: implicit/explicit animations and `Curves` driven by `DesignTokens.Motion`, `HapticFeedback`/`Haptics` for the haptic presets, and `MediaQuery.disableAnimations` for Reduce Motion.

Authoritative references to refresh before changing API-level guidance (registered in `source-registry.yaml`):

- Apple HIG — Playing haptics: `https://developer.apple.com/design/human-interface-guidelines/playing-haptics`
- Apple HIG — Motion: `https://developer.apple.com/design/human-interface-guidelines/motion`
- Apple HIG — Loading: `https://developer.apple.com/design/human-interface-guidelines/loading`
- Apple — Applying Liquid Glass to custom views: `https://developer.apple.com/documentation/SwiftUI/Applying-Liquid-Glass-to-custom-views`
- Motion (web-surface parity for landing/funnel only): `https://motion.dev/docs/react`

## The Five Details

### 1. Press states & spring physics

Tap a button in a premium app and watch the ~100ms between your finger landing and the action firing: a tiny scale-down, so the button feels like a physical object responding to you. In a cheap app, nothing happens until the action fires — a flat rectangle that responds to nothing. That gap is the difference, and most builders never think about it.

- **SwiftUI:** `.buttonStyle(.premiumPress)` (small scale + dim + spring-back + optional confirming haptic). On iOS 26 prefer `.buttonStyle(.glass)`/`.glassProminent` for system-shaped controls.
- **Spring, not linear.** Use `PremiumMotion.press` (a low-bounce spring on the fast token), not a flat ease. Springs read as physical; eases read as mechanical.
- **Every tappable surface** gets a press state — buttons, cards, list rows, icon buttons. A control that responds to nothing feels broken.
- Reduce Motion keeps the opacity/haptic cue and drops the scale transform.

### 2. Subtle animations

Subtle. Subtle. Subtle. The moment most builders discover an animation engine they animate everything — cards bounce in, headers parallax, tabs swirl, the home screen becomes a theme park. Stop.

- **Motion must answer a question the user just asked.** A list item fades in *because new data arrived*. A modal slides up *because the user requested it*. A button scales *because they pressed it*. If you cannot name the question, cut the animation.
- **Speed:** keep standard transitions in the **150–300ms** band (`PremiumMotion.standard` ≈ the base token). Longer starts to feel like the app showing off.
- **Tokenized, not improvised.** All durations/springs come from `DesignTokens.Motion`; no ad-hoc millisecond values. One scale across every surface.
- **Reduce Motion is mandatory.** Use `.premiumAnimation(_:value:)`, which collapses to an instant change when Reduce Motion is on. Never block first paint on an animation.

### 3. Haptics

Haptics are the closest thing in software to making a user physically trust your app: a success pattern when a form submits, a soft tick when a toggle flips, a warning when they're about to delete the wrong thing. You don't notice them when they're right; you notice them when they're missing.

- **The rule:** haptics confirm **state changes and decisions** — not navigation, not scrolling, not idle taps. Haptics on everything become noise and feel cheap.
- **SwiftUI:** prefer the declarative `.sensoryFeedback(for:trigger:)` for state-driven feedback; use the imperative `Haptics.Event.play()` for one-shot gesture moments (e.g. swipe-to-dismiss `onEnded`). Semantic events: `selection`, `impactLight`, `impactMedium`, `success`, `warning`, `error`.
- Map the event to the meaning, not the screen: `success` on completion, `warning` before a reversible destructive action, `selection` on a toggle/segment.

### 4. Keyboard behavior

The most user-hostile experience in mobile is a careless keyboard: the input gets covered, the submit button hides, the keyboard dismisses when you didn't ask or refuses when you do. This is the detail that separates serious builders from the rest.

- **SwiftUI auto-avoids** the keyboard via the safe area, so the work is the rest: `.premiumInteractiveKeyboardDismiss()` (drag-to-dismiss that follows the finger), a `KeyboardDoneToolbar` so a dismiss control stays reachable, and `@FocusState` with `.dismissKeyboardOnTap` / `.swipeFocusGesture` for intentional focus/blur.
- The submit/primary button must stay visible as the keyboard animates in.
- Dismissing should feel deliberate (drag or explicit Done), never jarring.

### 5. Loading & empty states

These are the screens nobody designs and everybody sees first.

- **Loading:** a spinner says "I'm working, please wait." Premium apps don't ask users to wait — they show what's coming. Use `.skeleton(isLoading)` (redaction-based skeleton + soft shimmer) so the layout's *shape and size* are preserved and content feels like it was always there. Reduce Motion shows a static placeholder. Skeletons also prevent the layout jumps cheap apps have when data lands. For AI/long waits, cycle short status text — reading makes the wait feel shorter than staring at a spinner.
- **Empty:** a list with no items is never a blank screen. Use `EmptyStateView` to say what goes here, why it's empty, and the one next step (a single primary action).

## The Compounding Effect

None of these alone makes an app premium. Press states without good keyboard handling still feel broken. Smooth keyboards without thoughtful empty states still feel hollow. Skeleton loaders without haptics still feel flat. Premium is what happens when you stack twenty of these decisions on top of each other.

## Acceptance Checklist

- [ ] Every tappable control has a press state (scale/dim spring or system Liquid Glass), with Reduce Motion handled.
- [ ] Animations exist only where they answer a user question; durations are tokenized and in the 150–300ms band.
- [ ] Haptics confirm decisions/state changes only — not navigation or scrolling.
- [ ] Keyboard never covers the input or submit; dismissal is intentional; focus/blur is deliberate.
- [ ] Loading uses size-preserving skeletons/shimmer (or status text), not a bare spinner; Reduce Motion degrades gracefully.
- [ ] Empty states explain what/why and offer one primary action.
- [ ] Reduce Motion verified on device for every animated surface.
- [ ] Motion reads `DesignTokens.Motion`; no ad-hoc millisecond values; no framer-motion in the mobile binary.

## Common Failures

- Flat buttons with no press feedback; controls that respond to nothing.
- Animating everything; theme-park motion that distracts instead of clarifying.
- Haptics on navigation/scroll/every tap until they become noise.
- Keyboard covers the input or hides the submit button; dismissal is jarring or impossible.
- Bare spinners and layout jumps instead of size-preserving skeletons.
- Blank empty states with no first action.
- Reduce Motion ignored; first paint blocked on an animation.
- Ad-hoc durations instead of the tokenized `motion.*` scale; framer-motion leaking into the mobile binary.
