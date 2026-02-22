using System;
using UnityEngine;

namespace EndlessRunner.Player
{
    public class SwipeInput : MonoBehaviour
    {
        [SerializeField] private float minSwipeDistance = 60f;
        [SerializeField] private float maxTapDuration = 0.25f;
        [SerializeField] private float doubleTapThreshold = 0.3f;

        public event Action OnSwipeLeft;
        public event Action OnSwipeRight;
        public event Action OnSwipeUp;
        public event Action OnSwipeDown;
        public event Action OnDoubleTap;

        private Vector2 _startPos;
        private float _startTime;
        private float _lastTapTime = -1f;
        private bool _isTracking;

        private void Update()
        {
            if (Input.touchSupported && Input.touchCount > 0)
            {
                HandleTouch(Input.GetTouch(0));
                return;
            }

            if (Input.GetMouseButtonDown(0))
            {
                BeginTracking(Input.mousePosition);
            }
            else if (Input.GetMouseButtonUp(0) && _isTracking)
            {
                EndTracking(Input.mousePosition);
            }
        }

        private void HandleTouch(Touch touch)
        {
            switch (touch.phase)
            {
                case TouchPhase.Began:
                    BeginTracking(touch.position);
                    break;
                case TouchPhase.Ended:
                case TouchPhase.Canceled:
                    if (_isTracking)
                    {
                        EndTracking(touch.position);
                    }
                    break;
            }
        }

        private void BeginTracking(Vector2 screenPosition)
        {
            _isTracking = true;
            _startPos = screenPosition;
            _startTime = Time.time;
        }

        private void EndTracking(Vector2 endPos)
        {
            _isTracking = false;
            Vector2 delta = endPos - _startPos;
            float duration = Time.time - _startTime;

            if (delta.magnitude < minSwipeDistance)
            {
                if (duration <= maxTapDuration)
                {
                    HandleTap();
                }
                return;
            }

            if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y))
            {
                if (delta.x > 0)
                {
                    OnSwipeRight?.Invoke();
                }
                else
                {
                    OnSwipeLeft?.Invoke();
                }
            }
            else
            {
                if (delta.y > 0)
                {
                    OnSwipeUp?.Invoke();
                }
                else
                {
                    OnSwipeDown?.Invoke();
                }
            }
        }

        private void HandleTap()
        {
            if (_lastTapTime > 0f && Time.time - _lastTapTime <= doubleTapThreshold)
            {
                OnDoubleTap?.Invoke();
                _lastTapTime = -1f;
                return;
            }

            _lastTapTime = Time.time;
        }
    }
}
