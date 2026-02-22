using System.Collections;
using EndlessRunner.Core;
using UnityEngine;

namespace EndlessRunner.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerRunnerController : MonoBehaviour
    {
        [Header("Lane Movement")]
        [SerializeField] private float laneOffset = 2.5f;
        [SerializeField] private float laneChangeSpeed = 11f;

        [Header("Forward Speed")]
        [SerializeField] private float baseForwardSpeed = 8f;
        [SerializeField] private float speedRampPerSecond = 0.12f;
        [SerializeField] private float maxForwardSpeed = 24f;

        [Header("Vertical Movement")]
        [SerializeField] private float jumpForce = 10f;
        [SerializeField] private float gravity = -28f;
        [SerializeField] private float slideDuration = 0.8f;
        [SerializeField] private float slideControllerHeight = 1f;

        [Header("References")]
        [SerializeField] private SwipeInput swipeInput;
        [SerializeField] private Animator animator;

        private CharacterController _characterController;
        private int _currentLane = 1;
        private float _verticalVelocity;
        private float _targetForwardSpeed;
        private float _defaultControllerHeight;
        private Vector3 _defaultControllerCenter;
        private bool _isSliding;
        private bool _isInvincible;
        private Coroutine _invincibleRoutine;

        public float ForwardSpeed => _targetForwardSpeed;
        public bool IsInvincible => _isInvincible;

        private void Awake()
        {
            _characterController = GetComponent<CharacterController>();
            _defaultControllerHeight = _characterController.height;
            _defaultControllerCenter = _characterController.center;
            _targetForwardSpeed = baseForwardSpeed;
        }

        private void OnEnable()
        {
            if (swipeInput == null)
            {
                return;
            }

            swipeInput.OnSwipeLeft += MoveLaneLeft;
            swipeInput.OnSwipeRight += MoveLaneRight;
            swipeInput.OnSwipeUp += Jump;
            swipeInput.OnSwipeDown += Slide;
            swipeInput.OnDoubleTap += ActivateHoverboard;
        }

        private void OnDisable()
        {
            if (swipeInput == null)
            {
                return;
            }

            swipeInput.OnSwipeLeft -= MoveLaneLeft;
            swipeInput.OnSwipeRight -= MoveLaneRight;
            swipeInput.OnSwipeUp -= Jump;
            swipeInput.OnSwipeDown -= Slide;
            swipeInput.OnDoubleTap -= ActivateHoverboard;
        }

        private void Update()
        {
            if (!GameManager.Instance.IsPlaying)
            {
                return;
            }

            _targetForwardSpeed = Mathf.Min(maxForwardSpeed, _targetForwardSpeed + speedRampPerSecond * Time.deltaTime);

            float targetX = (_currentLane - 1) * laneOffset;
            float deltaX = targetX - transform.position.x;
            float xSpeed = deltaX * laneChangeSpeed;

            if (_characterController.isGrounded && _verticalVelocity < 0f)
            {
                _verticalVelocity = -1f;
                animator?.SetBool("Grounded", true);
            }

            _verticalVelocity += gravity * Time.deltaTime;
            Vector3 movement = new Vector3(xSpeed, _verticalVelocity, _targetForwardSpeed);
            _characterController.Move(movement * Time.deltaTime);

            GameManager.Instance.AddDistance(_targetForwardSpeed * Time.deltaTime);
        }

        public void MoveLaneLeft()
        {
            _currentLane = Mathf.Max(0, _currentLane - 1);
            animator?.SetTrigger("Strafe");
        }

        public void MoveLaneRight()
        {
            _currentLane = Mathf.Min(2, _currentLane + 1);
            animator?.SetTrigger("Strafe");
        }

        public void Jump()
        {
            if (!_characterController.isGrounded)
            {
                return;
            }

            _verticalVelocity = jumpForce;
            animator?.SetBool("Grounded", false);
            animator?.SetTrigger("Jump");
        }

        public void Slide()
        {
            if (_isSliding || !_characterController.isGrounded)
            {
                return;
            }

            StartCoroutine(SlideRoutine());
        }

        public void ApplyJumpBoost(float multiplier, float duration)
        {
            StartCoroutine(JumpBoostRoutine(multiplier, duration));
        }

        public void SetInvincible(float duration)
        {
            if (_invincibleRoutine != null)
            {
                StopCoroutine(_invincibleRoutine);
            }

            _invincibleRoutine = StartCoroutine(InvincibleRoutine(duration));
        }

        public void ActivateHoverboard()
        {
            if (!GameManager.Instance.TryUseHoverboard())
            {
                return;
            }

            SetInvincible(GameManager.Instance.HoverboardShieldDuration);
            animator?.SetTrigger("Hoverboard");
        }

        private IEnumerator SlideRoutine()
        {
            _isSliding = true;
            animator?.SetBool("Slide", true);
            _characterController.height = slideControllerHeight;
            _characterController.center = new Vector3(_defaultControllerCenter.x, slideControllerHeight / 2f, _defaultControllerCenter.z);

            yield return new WaitForSeconds(slideDuration);

            _characterController.height = _defaultControllerHeight;
            _characterController.center = _defaultControllerCenter;
            animator?.SetBool("Slide", false);
            _isSliding = false;
        }

        private IEnumerator JumpBoostRoutine(float multiplier, float duration)
        {
            float originalJumpForce = jumpForce;
            jumpForce *= multiplier;
            yield return new WaitForSeconds(duration);
            jumpForce = originalJumpForce;
        }

        private IEnumerator InvincibleRoutine(float duration)
        {
            _isInvincible = true;
            yield return new WaitForSeconds(duration);
            _isInvincible = false;
        }

        private void OnControllerColliderHit(ControllerColliderHit hit)
        {
            if (!GameManager.Instance.IsPlaying)
            {
                return;
            }

            Obstacle obstacle = hit.collider.GetComponent<Obstacle>();
            if (obstacle == null)
            {
                return;
            }

            if (_isInvincible)
            {
                obstacle.Break();
                return;
            }

            GameManager.Instance.GameOver();
        }
    }
}
