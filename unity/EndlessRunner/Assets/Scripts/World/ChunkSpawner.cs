using System.Collections.Generic;
using EndlessRunner.Core;
using UnityEngine;

namespace EndlessRunner.World
{
    public class ChunkSpawner : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private List<GameObject> chunkPrefabs;
        [SerializeField] private int initialChunkCount = 6;
        [SerializeField] private float chunkLength = 25f;
        [SerializeField] private int keepChunksBehind = 2;

        private readonly Queue<GameObject> _spawnedChunks = new Queue<GameObject>();
        private float _nextSpawnZ;

        private void Start()
        {
            for (int i = 0; i < initialChunkCount; i++)
            {
                SpawnChunk();
            }
        }

        private void Update()
        {
            if (!GameManager.Instance.IsPlaying || player == null)
            {
                return;
            }

            while (player.position.z + (initialChunkCount * chunkLength) > _nextSpawnZ)
            {
                SpawnChunk();
            }

            while (_spawnedChunks.Count > 0)
            {
                GameObject oldest = _spawnedChunks.Peek();
                if (player.position.z - oldest.transform.position.z <= keepChunksBehind * chunkLength)
                {
                    break;
                }

                _spawnedChunks.Dequeue();
                Destroy(oldest);
            }
        }

        private void SpawnChunk()
        {
            if (chunkPrefabs.Count == 0)
            {
                return;
            }

            GameObject prefab = chunkPrefabs[Random.Range(0, chunkPrefabs.Count)];
            GameObject chunk = Instantiate(prefab, new Vector3(0f, 0f, _nextSpawnZ), Quaternion.identity);
            _spawnedChunks.Enqueue(chunk);
            _nextSpawnZ += chunkLength;
        }
    }
}
