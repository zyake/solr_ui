/**
 * コンポーネントを一元的に管理するためのリポジトリ。
 *
 * コンポーネントはファクトリ単位で登録し、コンポーネントが
 * 初めて取得されるタイミングで生成され、以後キャッシュされる。
 * そのため、コンポーネントのモデルとしてはシングルトンのみをサポートする。
 *
 * ファクトリ内から他のコンポーネントを参照したい場合は、
 * ファクトリ内のthisスコープでgetメソッドを呼ぶことで、
 * 連鎖的に依存関係を解決することができる。
 *
 * ■例
 * var repository = new ComponentRepository();
 * repository.addFactory("id", function() { return "ID-1" });
 * repository.addFactory("defaultName", function() { return this.get("id") + "-001" });
 *
 * // ID1-001が表示される
 * alert(repository.get("defaultName"));
 */
function ComponentRepository() {
}

ComponentRepository.prototype.initialize = function() {
    this.repository = {};
    this.factory = {};
}

ComponentRepository.create = function() {
    var repository = new ComponentRepository();
    repository.initialize();

    return repository;
}

ComponentRepository.prototype.addFactory = function(key, factory) {
    var duplicatedKey = this.factory[key] != null;
    if ( duplicatedKey ) {
        throw new Error("duplicated key: key=" + key);
    }

    this.factory[key] = factory;
}

ComponentRepository.prototype.get = function(key) {
    var existsComponent = this.repository[key] != null;
    if ( existsComponent ) {
        var component = this.repository[key];
        return component;
    }

    var targetFactory = this.factory[key];
    if ( targetFactory  == null ) {
        throw new Error("target factory not found: key=" + key);
    }
    var newComponent = targetFactory.call(this);
    this.repository[key] = newComponent;

    return newComponent;
}

/**
 * 全てのファクトリ関数を用いてインスタンス化する。
 */
ComponentRepository.prototype.instantiateAll = function() {
    for ( key in this.factory ) {
        if ( this.repository[key] == null ) {
            this.get(key);
        }
    }
}