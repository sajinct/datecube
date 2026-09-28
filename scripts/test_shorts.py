import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("shorts", Path(__file__).with_name("refresh-shorts.py"))
shorts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shorts)


def entry(index, title="Test Short"):
    video_id = f"short{index:06d}"
    return {"id": video_id, "title": title, "url": f"https://www.youtube.com/shorts/{video_id}"}


class ShortsTests(unittest.TestCase):
    def test_newest_five_unique_shorts_only(self):
        entries = [entry(0), entry(0), None, {**entry(9), "url": "https://www.youtube.com/watch?v=short000009"}]
        entries += [entry(i) for i in range(1, 8)]
        actual = shorts.select_shorts({"channel_id": shorts.CHANNEL_ID, "entries": entries})
        self.assertEqual([item[0] for item in actual], [entry(i)["id"] for i in range(5)])

    def test_one_short_is_not_duplicated(self):
        self.assertEqual(len(shorts.select_shorts({"channel_id": shorts.CHANNEL_ID, "entries": [entry(1)]})), 1)

    def test_wrong_channel_and_empty_results_fail_closed(self):
        for data in [{"channel_id": "wrong", "entries": [entry(1)]}, {"channel_id": shorts.CHANNEL_ID, "entries": []}]:
            with self.assertRaises(ValueError):
                shorts.select_shorts(data)

    def test_titles_escaped_and_other_content_preserved(self):
        page = "explainer" + shorts.START + "old" + shorts.END + "footer"
        result = shorts.update_page(page, [(entry(1)["id"], '<script>alert("x")</script>')])
        self.assertNotIn("<script>", result)
        self.assertIn("&lt;script&gt;", result)
        self.assertTrue(result.startswith("explainer"))
        self.assertTrue(result.endswith("footer"))
        with self.assertRaises(ValueError):
            shorts.update_page("no markers", [])


if __name__ == "__main__":
    unittest.main()
