import Array "mo:base/Array";
import Int "mo:base/Int";

actor {
  stable var highScores : [Int] = [];

  public func addScore(score : Int) : async () {
    highScores := Array.sort(Array.append<Int>(highScores, [score]), Int.compare);
    if (highScores.size() > 5) {
      highScores := Array.tabulate<Int>(5, func(i) { highScores[i] });
    };
  };

  public query func getHighScores() : async [Int] {
    highScores
  };
}
