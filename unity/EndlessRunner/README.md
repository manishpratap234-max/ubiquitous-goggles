# Endless Runner (Subway Surfers Style) - Unity MVP

This folder provides a Unity-ready C# implementation scaffold for a **3D endless runner mobile game** with:

- Auto-run forward player
- 3-lane swipe controls (left/right/up/down)
- Obstacles and game-over collisions
- Coins and power-ups
- Hoverboard activation via double tap (temporary shield)
- Infinite chunk spawning
- Score system (distance + coins + multiplier)
- HUD with pause and game-over states

## Included Scripts

- `Assets/Scripts/Core/GameManager.cs`
- `Assets/Scripts/Core/Obstacle.cs`
- `Assets/Scripts/Player/SwipeInput.cs`
- `Assets/Scripts/Player/PlayerRunnerController.cs`
- `Assets/Scripts/World/ChunkSpawner.cs`
- `Assets/Scripts/World/MovingTrain.cs`
- `Assets/Scripts/Collectibles/Coin.cs`
- `Assets/Scripts/Collectibles/PowerUp.cs`
- `Assets/Scripts/UI/HudController.cs`

## Unity Setup Steps

1. Create a new Unity 3D project (URP optional).
2. Copy `Assets/Scripts` from this folder into your Unity project's `Assets/Scripts`.
3. Create a scene with:
   - A `Player` object with:
     - `CharacterController`
     - `SwipeInput`
     - `PlayerRunnerController`
     - Tag set to `Player`
   - A `GameManager` object with `GameManager` script.
   - A `ChunkSpawner` object with `ChunkSpawner` script.
4. Create at least 2-3 chunk prefabs (`25m` length recommended):
   - Ground/tracks
   - Obstacles
   - Coin and power-up spawn points
5. Set up lanes at X positions:
   - Left: `-2.5`
   - Center: `0`
   - Right: `2.5`
6. UI setup:
   - Canvas + TMP text fields for score, coins, multiplier
   - Panels for pause and game-over
   - Wire buttons to `HudController` methods
7. Add colliders and trigger volumes for coins/power-ups.
8. Optional polish:
   - Animator controller with `Strafe`, `Jump`, `Slide`, `Hoverboard` triggers
   - Audio clips for running/coins/crash

## Gameplay Mapping

- Swipe Left/Right: lane change
- Swipe Up: jump
- Swipe Down: slide
- Double Tap: hoverboard shield (cooldown controlled by `GameManager`)

## Power-Ups Implemented

- `CoinMagnet`: pulls nearby coins for duration
- `Jetpack`: invincibility window
- `SuperJump`: temporary jump force boost
- `ScoreMultiplier2x`: 2x score multiplier for duration

## Mobile Build (Android APK)

1. Install Android Build Support in Unity Hub.
2. Go to `File > Build Settings > Android > Switch Platform`.
3. Configure `Player Settings` package name and min SDK.
4. Add your gameplay scene to Build Scenes.
5. Click `Build` to generate APK.

## Test Checklist

- Swipe response on device (left/right/up/down)
- Collision with static and moving obstacles
- Coin pickup and score increments
- Power-up activation and expiry timing
- Hoverboard double tap and shield behavior
- Long-run memory/performance stability (10+ minutes)

